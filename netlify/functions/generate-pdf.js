const puppeteer = require('puppeteer');

exports.handler = async (event, context) => {
  try {
    // CORS Headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers,
        body: ''
      };
    }

    // Parse form data
    const formData = JSON.parse(event.body);
    
    // Get the site URL (replace with your actual Netlify URL)
    const siteUrl = process.env.URL || 'https://your-site.netlify.app';
    
    // Launch browser
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({ width: 1200, height: 800 });
    
    // Navigate to the form page
    await page.goto(`${siteUrl}/`, { waitUntil: 'networkidle0' });
    
    // Fill form with data
    await page.evaluate((data) => {
      // Interviewer
      if (data.interviewer === 'Shirin') {
        document.querySelector('input[name="interviewer"][value="shirin"]').checked = true;
      } else if (data.interviewer === 'Felix') {
        document.querySelector('input[name="interviewer"][value="felix"]').checked = true;
      }
      
      // Name
      if (document.getElementById('name')) {
        document.getElementById('name').value = data.name || '';
      }
      
      // Position
      if (document.getElementById('position')) {
        document.getElementById('position').value = data.position || '';
      }
      
      // Area
      if (data.area === 'IT') {
        document.querySelector('input[name="area"][value="IT"]').checked = true;
      } else if (data.area === 'Non-IT') {
        document.querySelector('input[name="area"][value="Non-IT"]').checked = true;
      }
      
      // Location
      if (document.getElementById('other_location')) {
        document.getElementById('other_location').value = data.location || '';
      }
      
      // Candidate summary
      if (document.getElementById('candidate_summary')) {
        document.getElementById('candidate_summary').value = data.candidate_summary || '';
      }
      
      // Availability
      if (document.getElementById('availability')) {
        document.getElementById('availability').value = data.availability || '';
      }
      
      // Notice period
      if (document.getElementById('notice_period')) {
        document.getElementById('notice_period').value = data.notice_period || '';
      }
      
      // Current salary
      if (document.getElementById('current_salary')) {
        document.getElementById('current_salary').value = data.current_salary || '';
      }
      
      // Desired salary
      if (document.getElementById('desired_salary')) {
        document.getElementById('desired_salary').value = data.desired_salary || '';
      }
      
      // Benefits
      if (document.getElementById('benefits')) {
        document.getElementById('benefits').value = data.benefits || '';
      }
      
      // Top skills
      if (document.getElementById('top_skills')) {
        document.getElementById('top_skills').value = data.top_skills || '';
      }
      
      // Certifications
      if (document.getElementById('certifications')) {
        document.getElementById('certifications').value = data.certifications || '';
      }
      
      // Industry experience
      if (document.getElementById('industry_experience')) {
        document.getElementById('industry_experience').value = data.industry_experience || '';
      }
      
      // Tools/Software
      if (document.getElementById('tools_software')) {
        document.getElementById('tools_software').value = data.tools_software || '';
      }
      
      // Technical questions
      if (document.getElementById('technical_questions')) {
        document.getElementById('technical_questions').value = data.technical_questions || '';
      }
      
      // German level
      if (document.getElementById('german_level')) {
        document.getElementById('german_level').value = data.german_level || '';
      }
      
      // German TI checked
      if (data.german_ti_checked && document.querySelector(`input[name="german_ti_checked"][value="${data.german_ti_checked}"]`)) {
        document.querySelector(`input[name="german_ti_checked"][value="${data.german_ti_checked}"]`).checked = true;
      }
      
      // English level
      if (document.getElementById('english_level')) {
        document.getElementById('english_level').value = data.english_level || '';
      }
      
      // English TI checked
      if (data.english_ti_checked && document.querySelector(`input[name="english_ti_checked"][value="${data.english_ti_checked}"]`)) {
        document.querySelector(`input[name="english_ti_checked"][value="${data.english_ti_checked}"]`).checked = true;
      }
      
      // Trigger change events to show/hide fields
      const areaRadios = document.querySelectorAll('input[name="area"]');
      areaRadios.forEach(radio => {
        if (radio.checked) {
          radio.dispatchEvent(new Event('change'));
        }
      });
      
    }, formData);
    
    // Wait for images to load
    await page.waitForTimeout(2000);
    
    // Generate PDF
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    });
    
    await browser.close();
    
    // Return PDF as base64
    const pdfBase64 = pdf.toString('base64');
    
    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        pdf: pdfBase64,
        filename: `Interviewbogen_${formData.name}_${new Date().toISOString().split('T')[0]}.pdf`
      })
    };
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
}; 