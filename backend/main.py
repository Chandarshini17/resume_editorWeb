from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Models ---
class Section(BaseModel):
    section: str
    content: str

class Resume(BaseModel):
    data: dict

resume_storage = {}

# --- AI Enhancement ---
@app.post("/ai-enhance")
def enhance_section(section_data: Section):
    section = section_data.section.lower()
    content = section_data.content.strip()

    # Simulated AI enhancement logic
    improvements = {
        # Basic sections
        "name": f"{content} (Certified Professional)",
        "summary": (
            "Passionate and experienced software developer skilled in creating performant and scalable applications using React, Node.js, and modern tools."
        ),
        "skills": "React, Node.js, Express.js, MongoDB, TypeScript, Git, Agile",

        # Education
        "degree": f"{content} (Honors)",
        "institution": f"{content}, renowned for academic excellence",
        "year": f"{content} - Graduated with Distinction",

        # Experience
        "role": f"{content} | Senior-level Contributor",
        "company": f"{content} - Award-winning tech company",
        "years": f"{content} years (with consistent promotions)",

        # Projects
        "title": f"{content} 🚀",
        "description": f"{content} — A full-stack project with focus on performance, scalability, and user experience.",
        "link": f"{content} (Verified Project URL)",

        # Achievements
        "achievements": f"{content} 🏆 Recognized for outstanding contribution."
    }

    # Fallback for unknown fields
    improved = improvements.get(section, f"{content} — (professionally enhanced ✨)")

    return {"enhanced": improved}

# --- Save Resume ---
@app.post("/save-resume")
def save_resume(resume: Resume):
    resume_storage["resume"] = resume.data
    return {"status": "saved"}

# --- Retrieve Resume ---
@app.get("/get-resume")
def get_resume():
    return {"resume": resume_storage.get("resume", {})}
