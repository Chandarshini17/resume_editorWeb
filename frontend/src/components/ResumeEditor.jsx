import React, { useState, useEffect } from 'react';
import axios from 'axios';

const dummyResume = {
    name: "John Doe",
    summary: "Experienced developer skilled in React and Node.js.",
    education: [{ degree: "B.Tech", institution: "ABC University", year: "2022" }],
    experience: [{ role: "Software Developer", company: "XYZ Inc", years: "2" }],
    skills: ["React", "Node.js"],
    projects: [{ title: "Portfolio Website", description: "Personal website built with React", link: "https://example.com" }],
    achievements: ["Won Hackathon 2023", "Top performer in XYZ course"]
};

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '2rem auto',
        padding: '2rem',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 0 30px rgba(0,0,0,0.08)'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        marginBottom: '2rem'
    },
    section: {
        padding: '20px',
        backgroundColor: '#f9fbfc',
        borderLeft: '4px solid #2196f3',
        borderRadius: '10px',
        boxShadow: '0 1px 6px rgba(0,0,0,0.05)'
    },
    label: {
        fontWeight: 'bold',
        marginBottom: '6px',
        display: 'block',
        fontSize: '1rem',
        color: '#333'
    },
    input: {
        width: '100%',
        padding: '10px',
        fontSize: '1rem',
        borderRadius: '6px',
        border: '1px solid #ddd',
        marginBottom: '15px',
        outline: 'none',
        backgroundColor: '#fff'
    },
    textarea: {
        width: '100%',
        padding: '10px',
        fontSize: '1rem',
        borderRadius: '6px',
        border: '1px solid #ddd',
        marginBottom: '15px',
        resize: 'vertical',
        outline: 'none',
        backgroundColor: '#fff'
    },
    button: {
        background: '#2196f3',
        color: '#fff',
        padding: '10px 16px',
        border: 'none',
        borderRadius: '6px',
        fontWeight: '500',
        cursor: 'pointer',
        marginRight: '10px',
        marginBottom: '10px'
    },
    addButton: {
        background: '#43a047'
    },
    removeButton: {
        background: '#e53935'
    },
    fullWidthSection: {
        gridColumn: '1 / -1'
    },
    heading: {
        fontSize: '1.4rem',
        marginBottom: '15px',
        color: '#1976d2',
        borderBottom: '2px solid #ddd',
        paddingBottom: '5px'
    },
    actionRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        flexWrap: 'wrap'
    },
    uploadContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '2rem'
    },
    uploadBox: {
        border: '2px dashed #2196f3',
        borderRadius: '10px',
        padding: '30px',
        textAlign: 'center',
        width: '100%',
        maxWidth: '500px',
        cursor: 'pointer',
        backgroundColor: '#f0f8ff',
        transition: '0.3s ease',
    },
    uploadLabel: {
        display: 'block',
        cursor: 'pointer',
        color: '#1976d2'
    },
    uploadIcon: {
        fontSize: '3rem',
        marginBottom: '10px'
    }

};

function ResumeEditor() {
    const [resume, setResume] = useState(() => {
        const stored = localStorage.getItem("savedResume");
        return stored ? JSON.parse(stored) : null;
    });

    useEffect(() => {
        if (resume) localStorage.setItem("savedResume", JSON.stringify(resume));
    }, [resume]);

    const handleUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const type = file.name.split('.').pop().toLowerCase();
        if (type === 'pdf' || type === 'docx') {
            setResume(dummyResume);
        } else {
            alert("Please upload a .pdf or .docx file");
        }
    };

    const handleChange = (field, value) => setResume({ ...resume, [field]: value });

    const handleEnhance = async (section, value = null, index = null, subfield = null) => {
        try {
            const contentToSend = index !== null && subfield
                ? resume[section][index][subfield]
                : index !== null
                    ? resume[section][index]
                    : value || resume[section];

            const response = await axios.post("http://localhost:8000/ai-enhance", { section, content: contentToSend });
            const enhanced = response.data.enhanced;

            if (index !== null && subfield) {
                const updated = [...resume[section]];
                updated[index][subfield] = enhanced;
                setResume({ ...resume, [section]: updated });
            } else if (index !== null) {
                const updated = [...resume[section]];
                updated[index] = enhanced;
                setResume({ ...resume, [section]: updated });
            } else {
                setResume({ ...resume, [section]: enhanced });
            }
        } catch (error) {
            alert("AI enhancement failed");
        }
    };

    const handleListChange = (section, index, field, value) => {
        const updated = [...resume[section]];
        updated[index][field] = value;
        setResume({ ...resume, [section]: updated });
    };

    const handleAddEntry = (section, template) => {
        const updated = [...resume[section], template];
        setResume({ ...resume, [section]: updated });
    };

    const handleRemoveEntry = (section, index) => {
        const updated = [...resume[section]];
        updated.splice(index, 1);
        setResume({ ...resume, [section]: updated });
    };

    const handleSkillChange = (index, value) => {
        const updated = [...resume.skills];
        updated[index] = value;
        setResume({ ...resume, skills: updated });
    };

    const handleAddSkill = () => setResume({ ...resume, skills: [...resume.skills, ""] });

    const handleRemoveSkill = (index) => {
        const updated = [...resume.skills];
        updated.splice(index, 1);
        setResume({ ...resume, skills: updated });
    };

    const handleSave = async () => {
        try {
            await axios.post("http://localhost:8000/save-resume", { data: resume });
            alert("Resume saved!");
        } catch {
            alert("Save failed");
        }
    };

    const handleDownload = () => {
        const blob = new Blob([JSON.stringify(resume, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "resume.json";
        link.click();
        URL.revokeObjectURL(url);
        localStorage.removeItem("savedResume");
        setResume(null);
        alert("✅ Resume downloaded.");
    };

    return (
        <div style={styles.container}>
            <h2 style={{ textAlign: 'center' }}>Resume Editor</h2>

            {!resume ? (
                <div style={styles.uploadContainer}>
                    <div style={styles.uploadBox}>
                        <label htmlFor="fileInput" style={styles.uploadLabel}>
                            <div style={styles.uploadIcon}>📄</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>Click to upload your resume</div>
                            <div style={{ fontSize: '0.9rem', color: '#555' }}>Supported formats: <strong>.pdf</strong>, <strong>.docx</strong></div>
                        </label>
                        <input
                            id="fileInput"
                            type="file"
                            accept=".pdf,.docx"
                            onChange={handleUpload}
                            style={{ display: 'none' }}
                        />
                    </div>
                </div>
            ) : (
                <>
                    <div style={styles.grid}>
                        {/* Name */}
                        <div style={styles.section}>
                            <label style={styles.label}>Name</label>
                            <input style={styles.input} value={resume.name} onChange={e => handleChange("name", e.target.value)} />
                            <button style={styles.button} onClick={() => handleEnhance("name")}>Enhance</button>
                        </div>

                        {/* Summary */}
                        <div style={styles.section}>
                            <label style={styles.label}>Summary</label>
                            <textarea style={styles.textarea} value={resume.summary} onChange={e => handleChange("summary", e.target.value)} />
                            <button style={styles.button} onClick={() => handleEnhance("summary")}>Enhance</button>
                        </div>

                        {/* Education */}
                        <div style={styles.section}>
                            <h3 style={styles.heading}>Education</h3>
                            {resume.education.map((edu, index) => (
                                <div key={index}>
                                    <input style={styles.input} value={edu.degree} onChange={e => handleListChange("education", index, "degree", e.target.value)} placeholder="Degree" />
                                    <input style={styles.input} value={edu.institution} onChange={e => handleListChange("education", index, "institution", e.target.value)} placeholder="Institution" />
                                    <input style={styles.input} value={edu.year} onChange={e => handleListChange("education", index, "year", e.target.value)} placeholder="Year" />
                                    <div style={styles.actionRow}>
                                        <button style={styles.button} onClick={() => handleEnhance("education", null, index, "degree")}>Enhance</button>
                                        <button style={{ ...styles.button, ...styles.removeButton }} onClick={() => handleRemoveEntry("education", index)}>Remove</button>
                                    </div>
                                </div>
                            ))}
                            <button style={{ ...styles.button, ...styles.addButton }} onClick={() => handleAddEntry("education", { degree: "", institution: "", year: "" })}>Add</button>
                        </div>

                        {/* Experience */}
                        <div style={styles.section}>
                            <h3 style={styles.heading}>Experience</h3>
                            {resume.experience.map((exp, index) => (
                                <div key={index}>
                                    <input style={styles.input} value={exp.role} onChange={e => handleListChange("experience", index, "role", e.target.value)} placeholder="Role" />
                                    <input style={styles.input} value={exp.company} onChange={e => handleListChange("experience", index, "company", e.target.value)} placeholder="Company" />
                                    <input style={styles.input} value={exp.years} onChange={e => handleListChange("experience", index, "years", e.target.value)} placeholder="Years" />
                                    <div style={styles.actionRow}>
                                        <button style={styles.button} onClick={() => handleEnhance("experience", null, index, "role")}>Enhance</button>
                                        <button style={{ ...styles.button, ...styles.removeButton }} onClick={() => handleRemoveEntry("experience", index)}>Remove</button>
                                    </div>
                                </div>
                            ))}
                            <button style={{ ...styles.button, ...styles.addButton }} onClick={() => handleAddEntry("experience", { role: "", company: "", years: "" })}>Add</button>
                        </div>

                        {/* Skills - full width */}
                        <div style={{ ...styles.section, ...styles.fullWidthSection }}>
                            <h3 style={styles.heading}>Skills</h3>
                            {resume.skills.map((skill, index) => (
                                <div key={index} style={styles.actionRow}>
                                    <input style={{ ...styles.input, flex: 1 }} value={skill} onChange={e => handleSkillChange(index, e.target.value)} />
                                    <button style={styles.button} onClick={() => handleEnhance("skills", null, index)}>Enhance</button>
                                    <button style={{ ...styles.button, ...styles.removeButton }} onClick={() => handleRemoveSkill(index)}>Remove</button>
                                </div>
                            ))}
                            <button style={{ ...styles.button, ...styles.addButton }} onClick={handleAddSkill}>Add Skill</button>
                        </div>

                        {/* Projects - full width */}
                        <div style={{ ...styles.section, ...styles.fullWidthSection }}>
                            <h3 style={styles.heading}>Projects</h3>
                            {resume.projects.map((proj, index) => (
                                <div key={index}>
                                    <input style={styles.input} value={proj.title} onChange={e => handleListChange("projects", index, "title", e.target.value)} placeholder="Title" />
                                    <textarea style={styles.textarea} value={proj.description} onChange={e => handleListChange("projects", index, "description", e.target.value)} placeholder="Description" />
                                    <input style={styles.input} value={proj.link} onChange={e => handleListChange("projects", index, "link", e.target.value)} placeholder="Link" />
                                    <div style={styles.actionRow}>
                                        <button style={styles.button} onClick={() => handleEnhance("projects", null, index, "title")}>Enhance</button>
                                        <button style={styles.button} onClick={() => handleEnhance("projects", null, index, "description")}>Enhance</button>
                                        <button style={{ ...styles.button, ...styles.removeButton }} onClick={() => handleRemoveEntry("projects", index)}>Remove</button>
                                    </div>
                                </div>
                            ))}
                            <button style={{ ...styles.button, ...styles.addButton }} onClick={() => handleAddEntry("projects", { title: "", description: "", link: "" })}>Add Project</button>
                        </div>

                        {/* Achievements - full width */}
                        <div style={{ ...styles.section, ...styles.fullWidthSection }}>
                            <h3 style={styles.heading}>Achievements</h3>
                            {resume.achievements.map((ach, index) => (
                                <div key={index} style={styles.actionRow}>
                                    <input style={{ ...styles.input, flex: 1 }} value={ach} onChange={e => {
                                        const updated = [...resume.achievements];
                                        updated[index] = e.target.value;
                                        setResume({ ...resume, achievements: updated });
                                    }} />
                                    <button style={styles.button} onClick={() => handleEnhance("achievements", null, index)}>Enhance</button>
                                    <button style={{ ...styles.button, ...styles.removeButton }} onClick={() => {
                                        const updated = [...resume.achievements];
                                        updated.splice(index, 1);
                                        setResume({ ...resume, achievements: updated });
                                    }}>Remove</button>
                                </div>
                            ))}
                            <button style={{ ...styles.button, ...styles.addButton }} onClick={() => setResume({ ...resume, achievements: [...resume.achievements, ""] })}>Add Achievement</button>
                        </div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <button style={styles.button} onClick={handleSave}>💾 Save Resume</button>
                        <button style={{ ...styles.button, background: '#6a1b9a' }} onClick={handleDownload}>⬇️ Download JSON</button>
                    </div>
                </>
            )}
        </div>
    );
}

export default ResumeEditor;
