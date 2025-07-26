from fastapi import APIRouter, HTTPException, status
import google.generativeai as genai
import os

router = APIRouter()

# Configure Gemini model
gemini_model = genai.GenerativeModel(
    model_name="gemini-1.5-pro",
    generation_config={
        "temperature": 0.3,
        "top_p": 0.95,
        "top_k": 40,
        "max_output_tokens": 8192,
    }
)

@router.post("/project-plan")
async def generate_project_plan(
    project_title: str,
    project_description: str,
    timeline_weeks: int = 4,
    team_size: int = 3
):
    """Generate a project plan from a brief description."""
    try:
        prompt = f"""
        Create a comprehensive project plan for the following project:
        
        Title: {project_title}
        Description: {project_description}
        Timeline: {timeline_weeks} weeks
        Team Size: {team_size} people
        
        Your plan should include:
        1. Executive Summary
        2. Project Scope and Objectives
        3. Key Deliverables
        4. Timeline with milestones (broken down by week)
        5. Resource Allocation
        6. Risk Management
        7. Success Metrics
        
        Format the plan as a structured document with clear headings and bullet points where appropriate.
        """
        
        response = gemini_model.generate_content(prompt)
        plan = response.text
        
        return {"project_plan": plan}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating project plan: {str(e)}"
        )

@router.post("/report-template")
async def generate_report_template(
    report_type: str,
    report_topic: str,
    sections: list = None
):
    """Generate a report template with structure and placeholders."""
    try:
        if sections is None:
            sections = ["Introduction", "Methodology", "Findings", "Recommendations", "Conclusion"]
        
        section_text = "\n".join([f"- {section}" for section in sections])
        
        prompt = f"""
        Create a template for a {report_type} report on the topic of {report_topic}.
        
        The report should include these sections:
        {section_text}
        
        For each section, provide:
        1. A brief description of what should be included
        2. 2-3 bullet points of example content or key points to address
        3. Any relevant formatting suggestions
        
        Format the template as a structured document with clear headings and placeholder text.
        """
        
        response = gemini_model.generate_content(prompt)
        template = response.text
        
        return {"report_template": template}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating report template: {str(e)}"
        )

@router.post("/presentation-outline")
async def generate_presentation_outline(
    presentation_title: str,
    audience: str,
    duration_minutes: int = 15
):
    """Generate a presentation outline with slide suggestions."""
    try:
        prompt = f"""
        Create an outline for a {duration_minutes}-minute presentation titled "{presentation_title}" for an audience of {audience}.
        
        Your outline should include:
        1. A recommended slide structure (number of slides and their titles)
        2. Brief bullet points for the content of each slide
        3. Suggestions for visuals or data to include
        4. Estimated time allocation for each section
        
        Format the outline as a structured document with clear slide numbers, titles, and content suggestions.
        """
        
        response = gemini_model.generate_content(prompt)
        outline = response.text
        
        return {"presentation_outline": outline}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating presentation outline: {str(e)}"
        )
