#!/usr/bin/env python3
"""
Script to update all HTML files with the new Services dropdown navigation
"""
import os
import re
from pathlib import Path

# The new Services dropdown HTML
NEW_SERVICES_DROPDOWN = '''                    <li class="dropdown">
                        <a href="services.html" class="nav-link dropdown-toggle">Services <i class="fas fa-chevron-down" style="font-size: 0.8rem; margin-left: 5px;"></i></a>
                        <ul class="dropdown-menu">
                            <li><a href="house-cleaning.html"><i class="fas fa-home"></i> House Cleaning</a></li>
                            <li><a href="pressure-washing.html"><i class="fas fa-water"></i> Pressure Washing</a></li>
                            <li><a href="gutter-cleaning.html"><i class="fas fa-tree"></i> Gutter Cleaning</a></li>
                            <li><a href="car-detailing.html"><i class="fas fa-car"></i> Car Detailing</a></li>
                            <li><a href="garden-maintenance.html"><i class="fas fa-leaf"></i> Garden Maintenance</a></li>
                            <li><a href="carpet-cleaning.html"><i class="fas fa-rug"></i> Carpet Cleaning</a></li>
                            <li><a href="electricians.html"><i class="fas fa-plug"></i> Electricians</a></li>
                        </ul>
                    </li>'''

def update_html_file(filepath):
    """Update a single HTML file's navigation"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Pattern to match the old Industries link
        old_pattern = r'<li><a href="industries\.html" class="nav-link">Industries</a></li>'
        
        # Check if file needs updating
        if 'industries.html' in content and 'dropdown-menu' not in content:
            # Replace the old Industries link with the new Services dropdown
            updated_content = re.sub(old_pattern, NEW_SERVICES_DROPDOWN, content)
            
            if updated_content != content:
                # Write back
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(updated_content)
                print(f"✅ Updated: {filepath.name}")
                return True
            else:
                print(f"⚠️  Pattern not found in: {filepath.name}")
                return False
        else:
            print(f"⏭️  Skipped (already updated or no industries link): {filepath.name}")
            return False
            
    except Exception as e:
        print(f"❌ Error updating {filepath.name}: {e}")
        return False

def main():
    # Get current directory
    current_dir = Path(__file__).parent
    
    # Find all HTML files
    html_files = list(current_dir.glob('*.html'))
    
    # Exclude files we've already updated
    exclude_files = {'index.html', 'services.html', 'house-cleaning.html'}
    html_files = [f for f in html_files if f.name not in exclude_files]
    
    print(f"Found {len(html_files)} HTML files to check")
    print("=" * 50)
    
    updated_count = 0
    for html_file in html_files:
        if update_html_file(html_file):
            updated_count += 1
    
    print("=" * 50)
    print(f"✨ Complete! Updated {updated_count} files")

if __name__ == "__main__":
    main()
