# Logo Setup Instructions

## How to Add Your Logo

The website is now configured to display your Apex Leads Analytics logo in the hero section. Follow these steps:

### Step 1: Save the Logo Image
1. Take the logo image provided (the Apex Leads Analytics logo with the arrow)
2. Save it as `logo.png` in the same folder as your `index.html`
3. The file should be in: `/Users/moazzinzaman/Desktop/CODING AI/MZ LEAD GEN WEB/logo.png`

### Step 2: Logo Features
Your logo will automatically display with:
- **Floating Animation** - Smooth up and down motion
- **Pulsing Glow Effect** - Dynamic cyan-to-purple glow
- **Glowing Halo** - Animated radiant background
- **Drop Shadow** - Professional 3D depth effect
- **Particle Effects** - Small animated particles around the logo

### Step 3: Logo Display
The logo will appear:
- **Size**: 200x200px on desktop (responsive on mobile)
- **Location**: Centered above the "Apex Leads Analytics" title
- **Animation**: Continuous smooth floating and pulsing
- **Effects**: Glowing aura with particle effects

### Step 4: Customize if Needed

#### Change Logo Size
Edit `styles.css` and find:
```css
.logo-container {
    width: 200px;
    height: 200px;
}
```

#### Change Glow Color
Edit `styles.css` and modify:
```css
.logo-glow {
    background: radial-gradient(circle, rgba(0, 212, 255, 0.3) 0%, transparent 70%);
}
```

#### Adjust Animation Speed
Find these keyframes in `styles.css`:
```css
@keyframes logoFloat {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
}
```

### File Format Requirements
- **Format**: PNG (transparent background recommended)
- **Recommended Size**: 400x400px or larger (for high DPI displays)
- **Aspect Ratio**: Square (1:1)

### Troubleshooting

If the logo doesn't appear:
1. Make sure the file is named exactly `logo.png`
2. Check that it's in the correct folder
3. Refresh your browser (Ctrl+F5 or Cmd+Shift+R)
4. Check browser console (F12) for any errors

If the logo looks distorted:
1. Ensure the image is square (1:1 aspect ratio)
2. Use a PNG with transparent background
3. Save at high resolution (400x400px minimum)

### Alternative: Using a Different Format

If you want to use a different format (JPG, SVG, etc.), edit the `index.html` file:

Find this line:
```html
<img src="logo.png" alt="Apex Leads Analytics Logo" class="hero-logo">
```

Change `logo.png` to your file name, e.g.:
```html
<img src="logo.jpg" alt="Apex Leads Analytics Logo" class="hero-logo">
```

---

**That's it!** Once you save the logo file in the correct location, it will automatically appear with all the futuristic animations and effects.
