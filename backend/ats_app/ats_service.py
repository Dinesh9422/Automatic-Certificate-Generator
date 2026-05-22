"""
ATS Resume Analysis Service
Uses: pdfplumber, spaCy, scikit-learn TF-IDF, NLTK
"""
import re
from typing import Dict, List, Tuple

# ─── Job Role Keyword Database ───────────────────────────────────────────────
JOB_KEYWORDS: Dict[str, Dict[str, List[str]]] = {
    'Software Engineer': {
        'must':  ['Python', 'Java', 'C++', 'Git', 'Data Structures', 'Algorithms', 'REST API'],
        'good':  ['Docker', 'CI/CD', 'Microservices', 'Agile', 'SQL', 'Linux'],
        'bonus': ['Kubernetes', 'GraphQL', 'Redis', 'TypeScript', 'Terraform'],
    },
    'Data Scientist': {
        'must':  ['Python', 'Machine Learning', 'pandas', 'NumPy', 'scikit-learn', 'Statistics'],
        'good':  ['TensorFlow', 'PyTorch', 'SQL', 'Tableau', 'Deep Learning', 'R'],
        'bonus': ['Spark', 'Hadoop', 'MLflow', 'Airflow', 'AWS SageMaker'],
    },
    'Full Stack Developer': {
        'must':  ['React', 'Node.js', 'JavaScript', 'REST API', 'HTML', 'CSS', 'SQL'],
        'good':  ['TypeScript', 'MongoDB', 'Docker', 'Git', 'Redux', 'PostgreSQL'],
        'bonus': ['GraphQL', 'Next.js', 'Tailwind CSS', 'Kubernetes', 'AWS'],
    },
    'Machine Learning Engineer': {
        'must':  ['Python', 'Machine Learning', 'TensorFlow', 'scikit-learn', 'NumPy', 'Deep Learning'],
        'good':  ['PyTorch', 'Docker', 'Kubernetes', 'MLflow', 'SQL', 'REST API'],
        'bonus': ['CUDA', 'Spark', 'Airflow', 'AWS', 'GCP', 'Transformers'],
    },
    'DevOps Engineer': {
        'must':  ['Docker', 'Kubernetes', 'CI/CD', 'Linux', 'AWS', 'Git', 'Terraform'],
        'good':  ['Ansible', 'Jenkins', 'Prometheus', 'Grafana', 'Python', 'Bash'],
        'bonus': ['Istio', 'Vault', 'Helm', 'ArgoCD', 'GCP', 'Azure'],
    },
    'Backend Developer': {
        'must':  ['Python', 'Django', 'REST API', 'PostgreSQL', 'Git', 'Linux'],
        'good':  ['Redis', 'Celery', 'Docker', 'JWT', 'Nginx', 'FastAPI'],
        'bonus': ['Kubernetes', 'GraphQL', 'Elasticsearch', 'Kafka', 'gRPC'],
    },
}

DEFAULT_KEYWORDS = {
    'must':  ['Python', 'Git', 'Communication', 'Problem Solving'],
    'good':  ['Docker', 'Linux', 'Agile', 'SQL'],
    'bonus': ['AWS', 'Kubernetes', 'TypeScript'],
}

EDUCATION_KEYWORDS = ['B.E', 'B.Tech', 'M.E', 'M.Tech', 'MCA', 'MBA', 'Ph.D', 'Bachelor', 'Master', 'Degree', 'CGPA', 'GPA']
EXPERIENCE_KEYWORDS = ['experience', 'worked', 'internship', 'project', 'developed', 'designed', 'built', 'led', 'managed']


def extract_text_from_resume(file_path: str) -> str:
    """Extract plain text from PDF or DOC resume."""
    if file_path.lower().endswith('.pdf'):
        try:
            import pdfplumber
            text = ''
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    t = page.extract_text()
                    if t:
                        text += t + '\n'
            return text
        except Exception:
            pass
        try:
            import PyPDF2
            with open(file_path, 'rb') as f:
                reader = PyPDF2.PdfReader(f)
                return '\n'.join(p.extract_text() or '' for p in reader.pages)
        except Exception:
            return ''
    else:
        # DOCX
        try:
            import docx
            doc = docx.Document(file_path)
            return '\n'.join(p.text for p in doc.paragraphs)
        except Exception:
            return ''


def analyze_keywords(text: str, job_role: str, job_description: str = '') -> Tuple[List[str], List[str], float]:
    """Match resume keywords against job role requirements. Returns (matched, missing, score)."""
    keywords = JOB_KEYWORDS.get(job_role, DEFAULT_KEYWORDS)
    all_required = keywords['must'] + keywords['good']
    bonus        = keywords['bonus']

    matched  = [kw for kw in all_required + bonus if re.search(r'\b' + re.escape(kw) + r'\b', text, re.IGNORECASE)]
    missing  = [kw for kw in keywords['must'] if kw not in matched]

    # Score: must keywords weighted 60%, good 30%, bonus 10%
    must_score  = sum(1 for k in keywords['must']  if k in matched) / max(len(keywords['must']), 1)
    good_score  = sum(1 for k in keywords['good']  if k in matched) / max(len(keywords['good']), 1)
    bonus_score = sum(1 for k in bonus             if k in matched) / max(len(bonus), 1)

    keyword_score = (must_score * 0.6 + good_score * 0.3 + bonus_score * 0.1) * 100

    # Add JD matching with TF-IDF if description provided
    if job_description.strip():
        try:
            from sklearn.feature_extraction.text import TfidfVectorizer
            from sklearn.metrics.pairwise import cosine_similarity
            vectorizer = TfidfVectorizer(stop_words='english')
            tfidf_matrix = vectorizer.fit_transform([text, job_description])
            similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
            keyword_score = (keyword_score * 0.7) + (similarity * 100 * 0.3)
        except Exception:
            pass

    return matched, missing, round(min(keyword_score, 100), 1)


def extract_skills(text: str) -> List[str]:
    """Extract detected skills from resume text."""
    ALL_SKILLS = [
        'Python', 'Java', 'JavaScript', 'TypeScript', 'C', 'C++', 'C#', 'R', 'Go', 'Kotlin', 'Swift', 'Rust',
        'React', 'Angular', 'Vue.js', 'Next.js', 'Node.js', 'Django', 'Flask', 'FastAPI', 'Spring Boot',
        'PostgreSQL', 'MySQL', 'MongoDB', 'SQLite', 'Redis', 'Elasticsearch',
        'Docker', 'Kubernetes', 'Terraform', 'Ansible', 'Jenkins', 'GitLab CI', 'GitHub Actions',
        'AWS', 'Azure', 'GCP', 'Firebase', 'Vercel',
        'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'TensorFlow', 'PyTorch', 'scikit-learn',
        'pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Tableau', 'Power BI',
        'Git', 'Linux', 'Bash', 'REST API', 'GraphQL', 'Microservices', 'Agile', 'Scrum',
    ]
    return [s for s in ALL_SKILLS if re.search(r'\b' + re.escape(s) + r'\b', text, re.IGNORECASE)]


def score_education(text: str) -> float:
    """Score education section based on keywords."""
    found = sum(1 for kw in EDUCATION_KEYWORDS if re.search(r'\b' + re.escape(kw) + r'\b', text, re.IGNORECASE))
    return min(round((found / len(EDUCATION_KEYWORDS)) * 100 * 2, 1), 100)


def score_experience(text: str) -> float:
    """Score experience section."""
    found = sum(1 for kw in EXPERIENCE_KEYWORDS if re.search(r'\b' + kw + r'\b', text, re.IGNORECASE))
    return min(round((found / len(EXPERIENCE_KEYWORDS)) * 100 * 1.5, 1), 100)


def generate_suggestions(matched: List[str], missing: List[str], edu_score: float, text: str) -> List[dict]:
    """Generate AI-powered improvement suggestions."""
    suggestions = []

    for kw in missing[:3]:
        suggestions.append({'type': 'warning', 'msg': f'Add "{kw}" experience or mention it explicitly.'})

    if edu_score < 70:
        suggestions.append({'type': 'info', 'msg': 'Improve education section — add CGPA, institution name, and graduation year.'})
    else:
        suggestions.append({'type': 'success', 'msg': 'Education section is well-structured and ATS-friendly.'})

    if not re.search(r'\d+%|\d+x|reduced|improved|increased', text, re.IGNORECASE):
        suggestions.append({'type': 'info', 'msg': 'Add quantified achievements (e.g., "improved performance by 40%").'})

    if 'linkedin' not in text.lower():
        suggestions.append({'type': 'warning', 'msg': 'Add LinkedIn profile URL to your contact section.'})

    if len(text.split('\n')) < 30:
        suggestions.append({'type': 'info', 'msg': 'Resume seems short — expand on projects and responsibilities.'})

    return suggestions


def run_ats_pipeline(file_path: str, job_role: str, job_description: str = '') -> dict:
    """Full ATS analysis pipeline."""
    text = extract_text_from_resume(file_path)
    if not text.strip():
        raise ValueError('Could not extract text from resume. Please ensure the file is not scanned-only.')

    matched, missing, kw_score = analyze_keywords(text, job_role, job_description)
    skills       = extract_skills(text)
    edu_score    = score_education(text)
    exp_score    = score_experience(text)
    suggestions  = generate_suggestions(matched, missing, edu_score, text)

    # Weighted overall score
    overall = round(
        kw_score      * 0.35 +
        exp_score     * 0.25 +
        edu_score     * 0.20 +
        min(len(skills) * 3, 100) * 0.20,
        1
    )

    return {
        'overall_score':     min(overall, 100),
        'skills_score':      min(len(skills) * 4, 100),
        'experience_score':  exp_score,
        'education_score':   edu_score,
        'keyword_score':     kw_score,
        'matched_keywords':  matched,
        'missing_keywords':  missing,
        'extracted_skills':  skills,
        'suggestions':       suggestions,
    }
