from fastapi import APIRouter, HTTPException, status, Request
import google.generativeai as genai
import os

router = APIRouter()

# Configure Gemini model
gemini_model = genai.GenerativeModel(
    model_name="gemini-2.0-flash",
    generation_config={
        "temperature": 0.3,
        "top_p": 0.95,
        "top_k": 40,
        "max_output_tokens": 2048,
    }
)

@router.post("/project-plan")
async def generate_project_plan(request: Request):
    """Generate a project plan from a brief description."""
    try:
        # Parse request body
        body = await request.json()
        project_title = body.get("project_title", "Untitled Project")
        project_description = body.get("project_description", "No description provided")
        timeline_weeks = body.get("timeline_weeks", 4)
        team_size = body.get("team_size", 3)
        
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
        
        Format your response using markdown for better readability:
        - Use **bold** for important headings and key points
        - Use numbered lists (1., 2., 3.) for main sections
        - Use bullet points (-) for sub-items and details
        - Use proper paragraph breaks for better readability
        - Use tables where appropriate for timelines and resource allocation
        """
        
        response = gemini_model.generate_content(prompt)
        plan = response.text
        
        return {
            "content": plan,
            "project_plan": plan  # Keep both for compatibility
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating project plan: {str(e)}"
        )

@router.post("/report-template")
async def generate_report_template(request: Request):
    """Generate a report template with structure and placeholders."""
    try:
        body = await request.json()
        report_type = body.get("report_type", "General")
        report_topic = body.get("report_topic", "Sample Topic")
        sections = body.get("sections", ["Introduction", "Methodology", "Findings", "Recommendations", "Conclusion"])
        
        section_text = "\n".join([f"- {section}" for section in sections])
        
        prompt = f"""
        Create a template for a {report_type} report on the topic of {report_topic}.
        
        The report should include these sections:
        {section_text}
        
        For each section, provide:
        1. A brief description of what should be included
        2. 2-3 bullet points of example content or key points to address
        3. Any relevant formatting suggestions
        
        Format your response using markdown for better readability:
        - Use **bold** for section headings and important points
        - Use numbered lists (1., 2., 3.) for main sections
        - Use bullet points (-) for sub-items and examples
        - Use proper paragraph breaks for better readability
        - Include placeholders in [brackets] for content to be filled in
        """
        
        response = gemini_model.generate_content(prompt)
        template = response.text
        
        return {
            "content": template,
            "report_template": template  # Keep both for compatibility
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating report template: {str(e)}"
        )

@router.post("/presentation-outline")
async def generate_presentation_outline(request: Request):
    """Generate a presentation outline with slide suggestions."""
    try:
        body = await request.json()
        presentation_title = body.get("presentation_title", "Sample Presentation")
        audience = body.get("audience", "General Audience")
        duration_minutes = body.get("duration_minutes", 15)
        
        prompt = f"""
        Create an outline for a {duration_minutes}-minute presentation titled "{presentation_title}" for an audience of {audience}.
        
        Your outline should include:
        1. A recommended slide structure (number of slides and their titles)
        2. Brief bullet points for the content of each slide
        3. Suggestions for visuals or data to include
        4. Estimated time allocation for each section
        
        Format your response using markdown for better readability:
        - Use **bold** for slide titles and important headings
        - Use numbered lists (1., 2., 3.) for slide numbers and main sections
        - Use bullet points (-) for slide content and suggestions
        - Use proper paragraph breaks for better readability
        - Include time estimates for each section
        """
        
        response = gemini_model.generate_content(prompt)
        outline = response.text
        
        return {
            "content": outline,
            "presentation_outline": outline  # Keep both for compatibility
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating presentation outline: {str(e)}"
        )
