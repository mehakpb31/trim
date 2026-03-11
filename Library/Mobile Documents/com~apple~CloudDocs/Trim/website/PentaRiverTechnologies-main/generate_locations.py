import os
import re

# Configuration
TEMPLATE_FILE = 'pages/trimlight-kamloops.html'
OUTPUT_DIR = 'pages/locations'
SITEMAP_FILE = 'sitemap.xml'
BASE_URL = 'https://pentarivertech.com/pages/locations/'

# List of locations to generate pages for
LOCATIONS = [
    "Salmon Arm", "Merritt", "Sun Peaks", "Barriere", "Chase", "Sorrento", 
    "Blind Bay", "Tappen", "Enderby", "Logan Lake", "Tobiano", "Savona", 
    "Pritchard", "Monte Creek", "Westwold", "Falkland", "Knutsford", 
    "Little Fort", "McLure", "Louis Creek", "Quilchena", "Douglas Lake", 
    "Paul Lake", "Pinantan Lake", "Lac Le Jeune", "Monte Lake"
]

def ensure_dir(directory):
    if not os.path.exists(directory):
        os.makedirs(directory)

def generate_filename(location):
    return f"trimlight-{location.lower().replace(' ', '-')}.html"

def generate_location_page(template_content, location):
    # Basic replacements
    content = template_content
    
    # 1. Update Title
    content = re.sub(
        r'<title>Trimlight Kamloops \| Permanent Holiday & Accent Lighting \| Penta River Technologies</title>',
        f'<title>Trimlight {location} | Permanent Holiday & Accent Lighting | Penta River Technologies</title>',
        content
    )
    
    # 2. Update Description
    content = re.sub(
        r'content="Trimlight Kamloops by Penta River Technologies.*?"',
        f'content="Trimlight {location} by Penta River Technologies. Professional permanent holiday and accent lighting installation in {location}, BC. Never hang lights again!"',
        content
    )
    
    # 3. Update H1
    content = re.sub(
        r'<h1>Trimlight Kamloops</h1>',
        f'<h1>Trimlight {location}</h1>',
        content
    )
    
    # 4. Update "Serving..." text if present (or just general body text replacements)
    # We want to be careful not to break links, so we target specific text nodes if possible, 
    # but a global replace of "Kamloops" contextually is often effective if careful.
    # However, "Trimlight Kamloops" appears in the header link too.
    
    # Let's replace "Trimlight Kamloops" in content where it's text, not part of a filename (unless it's the self-link)
    # Strategy: Replace specific instances.
    
    # Replace "Trimlight Kamloops" in H2s or paragraphs (simple approach)
    # content = content.replace("Trimlight Kamloops", f"Trimlight {location}") 
    # The above is risky for filenames.
    
    # Targeted replacements:
    # Breadcrumbs or text references
    content = content.replace(">Trimlight Kamloops<", f">Trimlight {location}<")
    content = content.replace("Serving Kamloops", f"Serving {location}")
    content = content.replace("Kamloops Homeowner", f"{location} Homeowner")
    
    # Fix relative paths since we are moving one level deeper (pages/ -> pages/locations/)
    # Existing relative paths likely start with "../" (to go to root) or just "filename" (if sibling).
    # Since template is in pages/, it uses "../images" to go to root->images.
    # New files are in pages/locations/, so they need "../../images".
    
    content = content.replace('src="../', 'src="../../')
    content = content.replace('href="../', 'href="../../')
    content = content.replace('url(\'../', 'url(\'../../')
    
    # However, links to other pages in "pages/" (siblings to template) need to go up one level.
    # e.g., href="about.html" becomes href="../about.html"
    # Find links that do NOT start with "../" or "http" or "#"
    
    # This regex looks for href="something.html" and turns it into href="../something.html"
    def fix_sibling_links(match):
        link = match.group(1)
        if link.startswith('http') or link.startswith('#') or link.startswith('..') or link.startswith('mailto:') or link.startswith('tel:'):
            return match.group(0)
        return f'href="../{link}"'
        
    content = re.sub(r'href="([^"]+)"', fix_sibling_links, content)
    
    # Update Canonical (if it existed, or just metadata)
    
    return content

def update_sitemap(new_pages):
    # Read existing sitemap
    with open(SITEMAP_FILE, 'r') as f:
        lines = f.readlines()
    
    # Find end of urlset
    insert_idx = -1
    for i, line in enumerate(lines):
        if '</urlset>' in line:
            insert_idx = i
            break
            
    if insert_idx == -1:
        print("Error: Could not find closing </urlset> tag in sitemap.")
        return

    # Generate new entries
    new_entries = []
    import datetime
    today = datetime.date.today().isoformat()
    
    for page in new_pages:
        entry = f"""    <url>
        <loc>{BASE_URL}{page}</loc>
        <lastmod>{today}</lastmod>
        <priority>0.8</priority>
    </url>
"""
        new_entries.append(entry)
        
    # Insert and write
    final_lines = lines[:insert_idx] + new_entries + lines[insert_idx:]
    with open(SITEMAP_FILE, 'w') as f:
        f.writelines(final_lines)
    print(f"Added {len(new_pages)} pages to sitemap.")

def main():
    ensure_dir(OUTPUT_DIR)
    
    # Read template
    with open(TEMPLATE_FILE, 'r') as f:
        template_content = f.read()
    
    generated_files = []
    
    for location in LOCATIONS:
        filename = generate_filename(location)
        output_path = os.path.join(OUTPUT_DIR, filename)
        
        page_content = generate_location_page(template_content, location)
        
        with open(output_path, 'w') as f:
            f.write(page_content)
            
        generated_files.append(filename)
        print(f"Generated: {output_path}")
        
    # Update sitemap
    update_sitemap(generated_files)
    print("Generation complete!")

if __name__ == "__main__":
    main()
