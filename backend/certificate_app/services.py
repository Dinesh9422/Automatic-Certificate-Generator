"""
Certificate generation service using ReportLab + Pillow + QRCode.
"""
import os
import io
import qrcode
from PIL import Image, ImageDraw, ImageFont
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib import colors
from reportlab.lib.units import inch, cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image as RLImage
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.pdfgen import canvas
from django.conf import settings
from django.core.files.base import ContentFile
import uuid


# ─── Color Palette ──────────────────────────────────────────────────────────
GOLD       = colors.HexColor('#F0B90B')
DARK_BG    = colors.HexColor('#1a1a1a')
WHITE      = colors.white
DARK_GRAY  = colors.HexColor('#666666')
LIGHT_GRAY = colors.HexColor('#cccccc')


def generate_qr_code(cert_code: str) -> ContentFile:
    """Generate QR code image for a certificate."""
    verify_url = f"https://certifyai.app/verify/{cert_code}"
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=2,
    )
    qr.add_data(verify_url)
    qr.make(fit=True)

    img = qr.make_image(fill_color="#F0B90B", back_color="#1a1a1a")
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    buffer.seek(0)
    return ContentFile(buffer.read(), name=f'qr_{cert_code}.png')


def generate_certificate_pdf(certificate) -> ContentFile:
    """
    Generate a professional certificate PDF using ReportLab.
    Uses a dark theme with gold accents to match CertifyAI brand.
    """
    buffer = io.BytesIO()
    page_width, page_height = landscape(A4)

    c = canvas.Canvas(buffer, pagesize=landscape(A4))
    w, h = page_width, page_height

    # ── Background ──────────────────────────────────────────────────────────
    c.setFillColor(DARK_BG)
    c.rect(0, 0, w, h, fill=True, stroke=False)

    # ── Outer border ────────────────────────────────────────────────────────
    c.setStrokeColor(GOLD)
    c.setLineWidth(3)
    c.rect(20, 20, w - 40, h - 40, fill=False, stroke=True)

    c.setLineWidth(1)
    c.rect(30, 30, w - 60, h - 60, fill=False, stroke=True)

    # ── Header: organization ─────────────────────────────────────────────────
    c.setFillColor(GOLD)
    c.setFont('Helvetica-Bold', 11)
    org = certificate.organization or 'Institution of Excellence'
    c.drawCentredString(w / 2, h - 70, org.upper())

    # ── Title ────────────────────────────────────────────────────────────────
    c.setFillColor(WHITE)
    c.setFont('Helvetica-Bold', 28)
    type_labels = {
        'degree': 'DEGREE CERTIFICATE',
        'experience': 'EXPERIENCE CERTIFICATE',
        'completion': 'CERTIFICATE OF COMPLETION',
        'relieving': 'RELIEVING CERTIFICATE',
    }
    title = type_labels.get(certificate.cert_type, 'CERTIFICATE')
    c.drawCentredString(w / 2, h - 110, title)

    # ── Gold divider line ────────────────────────────────────────────────────
    c.setStrokeColor(GOLD)
    c.setLineWidth(1.5)
    c.line(w * 0.2, h - 125, w * 0.8, h - 125)

    # ── Body text ────────────────────────────────────────────────────────────
    c.setFillColor(LIGHT_GRAY)
    c.setFont('Helvetica', 12)
    c.drawCentredString(w / 2, h - 155, 'This is to certify that')

    # ── Recipient name ───────────────────────────────────────────────────────
    c.setFillColor(GOLD)
    c.setFont('Helvetica-Bold', 24)
    c.drawCentredString(w / 2, h - 190, certificate.name)

    # ── Underline ────────────────────────────────────────────────────────────
    c.setStrokeColor(DARK_GRAY)
    c.setLineWidth(0.5)
    name_width = len(certificate.name) * 13
    c.line(w / 2 - name_width / 2, h - 195, w / 2 + name_width / 2, h - 195)

    # ── Certificate body ─────────────────────────────────────────────────────
    c.setFillColor(LIGHT_GRAY)
    c.setFont('Helvetica', 11)

    body_lines = _build_body_lines(certificate)
    y = h - 230
    for line in body_lines:
        c.drawCentredString(w / 2, y, line)
        y -= 20

    # ── CGPA / Grade ─────────────────────────────────────────────────────────
    if certificate.cgpa:
        c.setFillColor(GOLD)
        c.setFont('Helvetica-Bold', 12)
        c.drawCentredString(w / 2, y - 10, f'CGPA: {certificate.cgpa}')
        y -= 30

    # ── Date & Cert ID ───────────────────────────────────────────────────────
    c.setFillColor(DARK_GRAY)
    c.setFont('Helvetica', 9)
    issue_date = str(certificate.issue_date) if certificate.issue_date else 'Date of Issue'
    c.drawString(60, 90, f'Issue Date: {issue_date}')
    c.drawString(60, 75, f'Certificate ID: {certificate.cert_code}')

    # ── Signature placeholders ───────────────────────────────────────────────
    sig_y = 80
    for label, x in [('Principal / Director', w * 0.25), ('Controller of Examinations', w * 0.75)]:
        c.setStrokeColor(GOLD)
        c.setLineWidth(0.8)
        c.line(x - 70, sig_y + 20, x + 70, sig_y + 20)
        c.setFillColor(LIGHT_GRAY)
        c.setFont('Helvetica', 9)
        c.drawCentredString(x, sig_y + 8, label)

    # ── QR Code ──────────────────────────────────────────────────────────────
    if certificate.qr_code:
        qr_path = os.path.join(settings.MEDIA_ROOT, str(certificate.qr_code))
        if os.path.exists(qr_path):
            c.drawImage(qr_path, w - 115, 55, width=80, height=80)
            c.setFillColor(DARK_GRAY)
            c.setFont('Helvetica', 7)
            c.drawCentredString(w - 75, 48, 'Scan to Verify')

    c.save()
    buffer.seek(0)
    return ContentFile(buffer.read(), name=f'certificate_{certificate.cert_code}.pdf')


def _build_body_lines(certificate):
    lines = []
    ct = certificate.cert_type

    if ct == 'degree':
        lines.append(f'has successfully completed the {certificate.course or "Undergraduate Program"}')
        lines.append(f'from the Department of {certificate.department}')
        if certificate.start_date and certificate.end_date:
            lines.append(f'during the period {certificate.start_date} to {certificate.end_date}')

    elif ct == 'experience':
        lines.append(f'has worked as {certificate.designation or "Employee"}')
        lines.append(f'in the {certificate.department} department')
        if certificate.start_date and certificate.end_date:
            lines.append(f'from {certificate.start_date} to {certificate.end_date}')
        lines.append('and has shown dedication and professionalism throughout the tenure.')

    elif ct == 'completion':
        lines.append(f'has successfully completed the {certificate.course or "Training Program"}')
        lines.append(f'organized by the {certificate.department} department')
        if certificate.end_date:
            lines.append(f'on {certificate.end_date}')

    elif ct == 'relieving':
        lines.append(f'has been relieved from the position of {certificate.designation or "Employee"}')
        lines.append(f'from the {certificate.department} department')
        if certificate.end_date:
            lines.append(f'with effect from {certificate.end_date}')

    return lines
