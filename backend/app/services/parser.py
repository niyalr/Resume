import io
from pypdf import PdfReader
from docx import Document

def extract_text(file_obj, filename: str) -> str:
    """
    Extracts text from a file object based on the file extension.
    Supports PDF, DOCX, and plain text formats.
    """
    file_bytes = file_obj.read()
    file_obj.seek(0)  # Reset file pointer for future reads if needed
    
    ext = filename.split('.')[-1].lower()
    
    if ext == 'pdf':
        try:
            pdf = PdfReader(io.BytesIO(file_bytes))
            text = ""
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
            return text
        except Exception as e:
            raise ValueError(f"Failed to parse PDF file: {str(e)}")
            
    elif ext in ['docx', 'doc']:
        try:
            doc = Document(io.BytesIO(file_bytes))
            text = ""
            for para in doc.paragraphs:
                text += para.text + "\n"
            return text
        except Exception as e:
            raise ValueError(f"Failed to parse Word document: {str(e)}")
            
    else:
        # Default to plain text decoding
        try:
            return file_bytes.decode('utf-8', errors='ignore')
        except Exception as e:
            raise ValueError(f"Failed to read text file: {str(e)}")