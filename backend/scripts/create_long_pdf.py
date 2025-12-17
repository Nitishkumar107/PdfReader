from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

def create_long_pdf(filename):
    c = canvas.Canvas(filename, pagesize=letter)
    width, height = letter
    
    text = """
    Voice Reader AI - Demo Content
    
    This is a demonstration of the Voice Reader application with a multi-page document.
    We are testing the synchronized highlighting and the independent scrolling behavior.
    
    The sidebar on the left should remain fixed while this content scrolls.
    The text should be highlighted sentence by sentence as it is read aloud.
    
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    """ * 5

    for i in range(1, 9):
        c.drawString(50, height - 50, f"Page {i}")
        text_object = c.beginText(50, height - 100)
        text_object.setFont("Helvetica", 12)
        
        # Add some bulk text
        lines = text.strip().split('\n')
        for line in lines:
            text_object.textLine(line.strip())
            
        c.drawText(text_object)
        c.showPage()
        
    c.save()

if __name__ == "__main__":
    create_long_pdf("long_demo.pdf")
