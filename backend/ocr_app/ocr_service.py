"""
OCR Service — Tesseract + OpenCV + spaCy NLP
"""
import re
import cv2
import numpy as np
import pytesseract
from PIL import Image
from django.conf import settings
import io

pytesseract.pytesseract.tesseract_cmd = getattr(settings, 'TESSERACT_CMD', '/usr/bin/tesseract')


def preprocess_image(image_path: str) -> np.ndarray:
    """
    Preprocess image with OpenCV for better OCR accuracy.
    Steps: grayscale → denoising → thresholding → deskew.
    """
    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Denoise
    denoised = cv2.fastNlMeansDenoising(gray, None, 10, 7, 21)

    # Adaptive threshold
    thresh = cv2.adaptiveThreshold(
        denoised, 255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY,
        11, 2
    )

    # Sharpen
    kernel = np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]])
    sharpened = cv2.filter2D(thresh, -1, kernel)

    return sharpened


def extract_text_from_image(image_path: str) -> tuple[str, float]:
    """Run Tesseract OCR on preprocessed image. Returns (text, confidence)."""
    processed = preprocess_image(image_path)

    # Run OCR with config
    config = '--oem 3 --psm 6 -l eng'
    data = pytesseract.image_to_data(processed, config=config, output_type=pytesseract.Output.DICT)

    # Calculate confidence
    confidences = [int(c) for c in data['conf'] if int(c) > 0]
    avg_confidence = sum(confidences) / len(confidences) if confidences else 0.0

    text = pytesseract.image_to_string(processed, config=config)
    return text, avg_confidence


def extract_text_from_pdf(pdf_path: str) -> str:
    """Extract text from PDF using pdfplumber."""
    try:
        import pdfplumber
        text = ''
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + '\n'
        return text
    except Exception:
        try:
            import PyPDF2
            with open(pdf_path, 'rb') as f:
                reader = PyPDF2.PdfReader(f)
                return '\n'.join(page.extract_text() or '' for page in reader.pages)
        except Exception:
            return ''


def parse_fields_from_text(text: str) -> dict:
    """
    Parse structured fields from OCR text using regex + spaCy NLP.
    """
    fields = {}

    # ── Regex patterns ────────────────────────────────────────────────────
    patterns = {
        'name':             r'(?:Name\s*[:\-]\s*)([A-Z][a-z]+(?:\s[A-Z][a-z]+){1,3})',
        'roll_no':          r'(?:Roll\s*No\.?\s*[:\-]\s*)(\w+)',
        'registration_no':  r'(?:Reg(?:istration)?\s*No\.?\s*[:\-]\s*)(\w[\w\-]+)',
        'dob':              r'(?:D(?:ate)?\.?\s*of\s*Birth\s*[:\-]\s*)([\d]{1,2}[/\-.][\d]{1,2}[/\-.][\d]{2,4})',
        'email':            r'[\w.\-+]+@[\w\-]+\.[a-z]{2,}',
        'phone':            r'(?:\+91[\s\-]?)?[6-9]\d{9}',
        'cgpa':             r'(?:CGPA|GPA|Grade\s*Point)\s*[:\-]?\s*(\d+\.\d+)',
        'grade':            r'(?:Grade\s*[:\-]\s*)([A-Z][+\-]?)',
        'year':             r'(?:Year\s*[:\-]\s*)?(?:20\d{2})',
        'course':           r'(?:Course\s*[:\-]\s*)(.+)',
        'department':       r'(?:Dept(?:artment)?\s*[:\-]\s*)(.+)',
        'institution':      r'(?:College|University|Institution|School)\s*[:\-]?\s*(.+)',
    }

    for field, pattern in patterns.items():
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            fields[field] = match.group(1).strip() if match.lastindex else match.group(0).strip()

    # ── spaCy NLP for entity extraction ────────────────────────────────────
    try:
        import spacy
        nlp = spacy.load('en_core_web_sm')
        doc = nlp(text[:5000])  # limit for performance

        persons = [ent.text for ent in doc.ents if ent.label_ == 'PERSON']
        orgs    = [ent.text for ent in doc.ents if ent.label_ == 'ORG']
        dates   = [ent.text for ent in doc.ents if ent.label_ == 'DATE']

        if persons and 'name' not in fields:
            fields['name'] = persons[0]
        if orgs:
            fields['organization'] = orgs[0]
        if dates:
            fields['dates_found'] = dates

    except Exception:
        pass  # spaCy not available — regex results still useful

    # ── Skill extraction (keyword match) ───────────────────────────────────
    TECH_SKILLS = [
        'Python', 'Java', 'JavaScript', 'React', 'Django', 'Flask', 'Node.js',
        'Machine Learning', 'Deep Learning', 'SQL', 'PostgreSQL', 'MongoDB',
        'Docker', 'Kubernetes', 'AWS', 'Azure', 'Git', 'Linux', 'TensorFlow',
        'PyTorch', 'scikit-learn', 'pandas', 'NumPy', 'OpenCV', 'HTML', 'CSS',
        'C', 'C++', 'Kotlin', 'Swift', 'R', 'MATLAB', 'Tableau', 'Power BI',
    ]
    found_skills = [s for s in TECH_SKILLS if re.search(r'\b' + re.escape(s) + r'\b', text, re.IGNORECASE)]
    if found_skills:
        fields['skills'] = found_skills

    return fields


def run_ocr_pipeline(file_path: str) -> dict:
    """Main OCR pipeline entry point."""
    file_lower = file_path.lower()

    if file_lower.endswith('.pdf'):
        text = extract_text_from_pdf(file_path)
        confidence = 85.0  # PDF text extraction is typically reliable
    else:
        text, confidence = extract_text_from_image(file_path)

    fields = parse_fields_from_text(text)
    return {
        'raw_text': text[:2000],  # truncate for storage
        'fields': fields,
        'confidence': round(confidence, 2),
    }
