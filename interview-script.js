document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('interviewForm');
    const submitBtn = document.querySelector('.submit-btn');
    const successMessage = document.querySelector('.success-message');
    const summaryCounter = document.getElementById('summary_counter');
    const summaryTextarea = document.getElementById('candidate_summary');
    const bannerImage = document.querySelector('.banner-image');
    const languageSection = document.getElementById('language-section');
    const itLanguageSection = document.getElementById('it-language-section');
    const englishSection = document.getElementById('english-section');
    const englishTiSection = document.getElementById('english-ti-section');

    // Interviewer-Auswahl - Headerbild ändern
    const interviewerRadios = document.querySelectorAll('input[name="interviewer"]');
    interviewerRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'shirin') {
                bannerImage.src = '250205_HR_Vorstellungsbanner_Active-Sourcing_Shirin.jpg';
                bannerImage.alt = 'Shirin Banner';
            } else if (this.value === 'felix') {
                bannerImage.src = '250205_HR_Vorstellungsbanner_Active-Sourcing_Felix.jpg';
                bannerImage.alt = 'Felix Banner';
            }
        });
    });

    // IT/Non-IT Auswahl - Felder ein-/ausblenden
    const areaRadios = document.querySelectorAll('input[name="area"]');
    areaRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const isITSelected = document.querySelector('input[name="area"][value="IT"]').checked;
            
            if (isITSelected) {
                // IT-Bereich: Alle Felder anzeigen
                languageSection.style.display = 'block';
                englishSection.style.display = 'block';
                englishTiSection.style.display = 'block';
                itLanguageSection.style.display = 'block';
            } else {
                // Non-IT-Bereich: Nur Deutschkenntnisse anzeigen
                languageSection.style.display = 'block';
                englishSection.style.display = 'none';
                englishTiSection.style.display = 'none';
                itLanguageSection.style.display = 'none';
                // Englisch- und IT-Felder leeren
                clearEnglishAndITFields();
            }
        });
    });

    // Position überwachen für Englischkenntnisse (nur bei IT-Bereich relevant)
    const positionInput = document.getElementById('position');
    if (positionInput) {
        positionInput.addEventListener('input', function() {
            if (document.querySelector('input[name="area"][value="IT"]')?.checked) {
                checkPositionForEnglish();
            }
        });
    }

    // Funktion zum Prüfen der Position für Englischkenntnisse (nur bei IT)
    function checkPositionForEnglish() {
        const position = document.getElementById('position')?.value.toLowerCase() || '';
        const isITPosition = position.includes('it') || position.includes('developer') || 
                           position.includes('programmierer') || position.includes('software') ||
                           position.includes('engineer') || position.includes('architekt') ||
                           position.includes('admin') || position.includes('system') ||
                           position.includes('data') || position.includes('analyst') ||
                           position.includes('devops') || position.includes('frontend') ||
                           position.includes('backend') || position.includes('fullstack');
        
        if (isITPosition) {
            englishSection.style.display = 'block';
            englishTiSection.style.display = 'block';
        } else {
            englishSection.style.display = 'none';
            englishTiSection.style.display = 'none';
            // Englisch-Felder leeren
            document.getElementById('english_level').value = '';
            document.querySelectorAll('input[name="english_ti_checked"]').forEach(radio => radio.checked = false);
        }
    }

    // Hilfsfunktionen zum Leeren der Felder
    function clearLanguageFields() {
        document.getElementById('german_level').value = '';
        document.querySelectorAll('input[name="german_ti_checked"]').forEach(radio => radio.checked = false);
    }

    function clearITFields() {
        document.querySelectorAll('input[name="it_language_type"]').forEach(checkbox => checkbox.checked = false);
        document.querySelectorAll('input[name="frontend_details"]').forEach(input => input.value = '');
        document.querySelectorAll('input[name="backend_details"]').forEach(input => input.value = '');
        document.querySelectorAll('input[name="fullstack_details"]').forEach(input => input.value = '');
        document.querySelectorAll('input[name="other_it_details"]').forEach(input => input.value = '');
    }

    function clearEnglishAndITFields() {
        document.getElementById('english_level').value = '';
        document.querySelectorAll('input[name="english_ti_checked"]').forEach(radio => radio.checked = false);
        document.querySelectorAll('input[name="it_language_type"]').forEach(checkbox => checkbox.checked = false);
        document.querySelectorAll('input[name="frontend_details"]').forEach(input => input.value = '');
        document.querySelectorAll('input[name="backend_details"]').forEach(input => input.value = '');
        document.querySelectorAll('input[name="fullstack_details"]').forEach(input => input.value = '');
        document.querySelectorAll('input[name="other_it_details"]').forEach(input => input.value = '');
    }

    // Zeichenzähler für Candidate Summary
    if (summaryTextarea && summaryCounter) {
        summaryTextarea.addEventListener('input', function() {
            const length = this.value.length;
            summaryCounter.textContent = length;
            
            if (length > 650) {
                summaryCounter.classList.add('error');
                summaryCounter.classList.remove('warning');
            } else if (length > 500) {
                summaryCounter.classList.add('warning');
                summaryCounter.classList.remove('error');
            } else {
                summaryCounter.classList.remove('error', 'warning');
            }
        });
    }

    // Formular-Absende-Handler
    form.addEventListener('submit', async function(event) {
        event.preventDefault(); // Standard-Formularversand verhindern

        submitBtn.disabled = true;
        submitBtn.textContent = 'Erstelle PDF und sende...';

        try {
            console.log('=== FORMULAR-START ===');
            
            // Einfache Formulardaten sammeln (sicher)
            const formData = {
                interviewer: document.querySelector('input[name="interviewer"]:checked')?.value || 'Nicht angegeben',
                name: (document.getElementById('name')?.value) || 'Nicht angegeben',
                position: (document.getElementById('position')?.value) || 'Nicht angegeben',
                area: document.querySelector('input[name="area"]:checked')?.value || 'Nicht angegeben',
                location: (document.getElementById('other_location')?.value) || 'Nicht angegeben',
                candidate_summary: (document.getElementById('candidate_summary')?.value) || 'Nicht angegeben',
                availability: (document.getElementById('availability')?.value) || 'Nicht angegeben',
                notice_period: (document.getElementById('notice_period')?.value) || 'Nicht angegeben',
                current_salary: (document.getElementById('current_salary')?.value) || 'Nicht angegeben',
                desired_salary: (document.getElementById('desired_salary')?.value) || 'Nicht angegeben',
                benefits: (document.getElementById('benefits')?.value) || 'Nicht angegeben',
                top_skills: (document.getElementById('top_skills')?.value) || 'Nicht angegeben',
                certifications: (document.getElementById('certifications')?.value) || 'Nicht angegeben',
                industry_experience: (document.getElementById('industry_experience')?.value) || 'Nicht angegeben',
                tools_software: (document.getElementById('tools_software')?.value) || 'Nicht angegeben',
                technical_questions: (document.getElementById('technical_questions')?.value) || 'Nicht angegeben',
                german_level: (document.getElementById('german_level')?.value) || 'Nicht angegeben',
                german_ti_checked: document.querySelector('input[name="german_ti_checked"]:checked')?.value || 'Nicht angegeben',
                english_level: (document.getElementById('english_level')?.value) || 'Nicht angegeben',
                english_ti_checked: document.querySelector('input[name="english_ti_checked"]:checked')?.value || 'Nicht angegeben',
                it_languages: getITLanguagesData()
            };

            console.log('Formulardaten gesammelt:', formData);

            // Formular absenden - Mit PDF-Generierung
            await submitForm(formData);

        } catch (error) {
            console.log('=== CATCH FEHLER ===');
            console.error('Fehler beim Absenden des Formulars:', error);
            console.error('Error Stack:', error.stack);
            alert('Es gab einen Fehler beim Absenden des Formulars. Bitte versuchen Sie es erneut.');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Interviewbogen absenden';
        }
    });

    // Hilfsfunktion für Checkbox-Werte
    function getCheckedValues(name) {
        const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`);
        return Array.from(checkboxes).map(cb => cb.value).join(', ') || 'Nicht angegeben';
    }

    // Hilfsfunktion für IT-Sprachen Daten
    function getITLanguagesData() {
        const itData = [];
        
        // Frontend
        if (document.querySelector('input[name="it_language_type"][value="Frontend"]')?.checked) {
            const frontendDetails = document.querySelector('input[name="frontend_details"]')?.value || '';
            itData.push(`Frontend: ${frontendDetails}`);
        }
        
        // Backend
        if (document.querySelector('input[name="it_language_type"][value="Backend"]')?.checked) {
            const backendDetails = document.querySelector('input[name="backend_details"]')?.value || '';
            itData.push(`Backend: ${backendDetails}`);
        }
        
        // FullStack
        if (document.querySelector('input[name="it_language_type"][value="FullStack"]')?.checked) {
            const fullstackDetails = document.querySelector('input[name="fullstack_details"]')?.value || '';
            itData.push(`FullStack: ${fullstackDetails}`);
        }
        
        // Sonstiges
        if (document.querySelector('input[name="it_language_type"][value="Sonstiges"]')?.checked) {
            const otherDetails = document.querySelector('input[name="other_it_details"]')?.value || '';
            itData.push(`Sonstiges: ${otherDetails}`);
        }
        
        return itData.length > 0 ? itData.join('; ') : 'Nicht angegeben';
    }

    // PDF Generierung - Puppeteer Serverless Function
    async function generatePDF(formData) {
        return new Promise((resolve, reject) => {
            try {
                // Netlify Function URL (wird automatisch gesetzt)
                const functionUrl = '/.netlify/functions/generate-pdf';

                console.log('Sende Daten an Puppeteer-Funktion...');

                // Daten an Puppeteer-Funktion senden
                fetch(functionUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        console.log('PDF erfolgreich generiert!');

                        // Base64 zu Blob konvertieren
                        const pdfBytes = atob(data.pdf);
                        const pdfArray = new Uint8Array(pdfBytes.length);
                        for (let i = 0; i < pdfBytes.length; i++) {
                            pdfArray[i] = pdfBytes.charCodeAt(i);
                        }
                        const pdfBlob = new Blob([pdfArray], { type: 'application/pdf' });

                        resolve(pdfBlob);
                    } else {
                        throw new Error(data.error || 'Unbekannter Fehler');
                    }
                })
                .catch(error => {
                    console.error('Fehler beim API-Aufruf:', error);
                    reject(error);
                });

            } catch (error) {
                console.error('Fehler bei PDF-Generierung:', error);
                reject(error);
            }
        });
    }

    // Formular absenden - Mit PDF-Generierung
    async function submitForm(formData) {
        try {
            console.log('Erstelle PDF...');
            
            // PDF erstellen
            const pdfBlob = await generatePDF(formData);
            console.log('PDF erstellt:', pdfBlob);
            
            // Automatischer PDF-Download
            const pdfUrl = URL.createObjectURL(pdfBlob);
            const downloadLink = document.createElement('a');
            downloadLink.href = pdfUrl;
            downloadLink.download = `Interviewbogen_${formData.name || 'Kandidat'}_${new Date().toISOString().split('T')[0]}.pdf`;
            downloadLink.style.display = 'none';
            document.body.appendChild(downloadLink);
            
            // PDF automatisch herunterladen
            downloadLink.click();
            
            // Download-Link entfernen
            setTimeout(() => {
                document.body.removeChild(downloadLink);
                URL.revokeObjectURL(pdfUrl);
            }, 1000);

            // EmailJS Template-Parameter
            const templateParams = {
                interviewer: formData.interviewer || 'Nicht angegeben',
                name: formData.name || 'Nicht angegeben',
                position: formData.position || 'Nicht angegeben',
                area: formData.area || 'Nicht angegeben',
                location: formData.location || 'Nicht angegeben',
                candidate_summary: formData.candidate_summary || 'Nicht angegeben',
                availability: formData.availability || 'Nicht angegeben',
                notice_period: formData.notice_period || 'Nicht angegeben',
                current_salary: formData.current_salary || 'Nicht angegeben',
                desired_salary: formData.desired_salary || 'Nicht angegeben',
                benefits: formData.benefits || 'Nicht angegeben',
                top_skills: formData.top_skills || 'Nicht angegeben',
                certifications: formData.certifications || 'Nicht angegeben',
                industry_experience: formData.industry_experience || 'Nicht angegeben',
                tools_software: formData.tools_software || 'Nicht angegeben',
                technical_questions: formData.technical_questions || 'Nicht angegeben',
                german_level: formData.german_level || 'Nicht angegeben',
                german_ti_checked: formData.german_ti_checked || 'Nein',
                english_level: formData.english_level || 'Nicht angegeben',
                english_ti_checked: formData.english_ti_checked || 'Nein',
                it_languages: formData.it_languages || 'Nicht angegeben'
            };

            // E-Mail senden
            await emailjs.send('service_d0czshk', 'template_mkbbqrt', templateParams);
            
            console.log('E-Mail erfolgreich gesendet!');
            
            // Erfolgsmeldung anzeigen
            showSuccessMessage('Formular erfolgreich abgesendet! PDF wurde heruntergeladen und E-Mail gesendet.');
            
            // Formular zurücksetzen
            document.getElementById('interview-form').reset();
            
            // Alle Felder zurücksetzen
            resetAllFields();
            
        } catch (error) {
            console.error('Fehler beim Senden:', error);
            showErrorMessage('Es gab einen Fehler beim Absenden des Formulars. Bitte versuchen Sie es erneut.');
        }
    }

    // Hilfsfunktionen für Erfolgs-/Fehlermeldungen
    function showSuccessMessage(message) {
        successMessage.style.display = 'block';
        successMessage.textContent = message;
        submitBtn.disabled = false;
        submitBtn.textContent = 'Interviewbogen absenden';
    }

    function showErrorMessage(message) {
        alert(message);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Interviewbogen absenden';
    }

    function resetAllFields() {
        if (summaryCounter) {
            summaryCounter.textContent = '0';
            summaryCounter.classList.remove('error', 'warning');
        }
        // Felder wieder auf Standard zurücksetzen
        languageSection.style.display = 'none';
        englishSection.style.display = 'none';
        englishTiSection.style.display = 'none';
        itLanguageSection.style.display = 'none';
    }

    // Blob zu Base64 konvertieren
    function blobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

}); 
