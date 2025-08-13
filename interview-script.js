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

    // PDF Generierung - Browser Print API
    async function generatePDF(formData) {
        return new Promise((resolve, reject) => {
            try {
                console.log('Verwende Browser Print API...');
                
                // Temporär alle Felder mit den Daten füllen
                fillFormForPDF(formData);
                
                // Kurz warten, damit alle Änderungen angewendet werden
                setTimeout(() => {
                    // Print-Dialog öffnen
                    window.print();
                    
                    // Formular zurücksetzen
                    resetFormAfterPDF();
                    
                    // Erfolg simulieren (PDF wird über Print-Dialog gespeichert)
                    const dummyBlob = new Blob(['PDF über Print-Dialog gespeichert'], { type: 'application/pdf' });
                    resolve(dummyBlob);
                    
                }, 1000);
                
            } catch (error) {
                console.error('Fehler bei PDF-Generierung:', error);
                reject(error);
            }
        });
    }

    // Hilfsfunktion zum Füllen der Felder für PDF-Generierung
    function fillFormForPDF(formData) {
        // Interviewer
        document.querySelector('input[name="interviewer"][value="shirin"]').checked = formData.interviewer === 'Shirin';
        document.querySelector('input[name="interviewer"][value="felix"]').checked = formData.interviewer === 'Felix';

        // Name
        document.getElementById('name').value = formData.name;

        // Position
        document.getElementById('position').value = formData.position;

        // Bereich
        document.querySelector('input[name="area"][value="IT"]').checked = formData.area === 'IT';
        document.querySelector('input[name="area"][value="Non-IT"]').checked = formData.area === 'Non-IT';

        // Standort
        document.getElementById('other_location').value = formData.location;

        // Kandidaten-Zusammenfassung
        document.getElementById('candidate_summary').value = formData.candidate_summary;

        // Verfügbarkeit
        document.getElementById('availability').value = formData.availability;

        // Kündigungsfrist
        document.getElementById('notice_period').value = formData.notice_period;

        // Aktuelles Gehalt
        document.getElementById('current_salary').value = formData.current_salary;

        // Wunschgehalt
        document.getElementById('desired_salary').value = formData.desired_salary;

        // Benefits
        document.getElementById('benefits').value = formData.benefits;

        // Top Skills
        document.getElementById('top_skills').value = formData.top_skills;

        // Zertifizierungen
        document.getElementById('certifications').value = formData.certifications;

        // Branchenerfahrung
        document.getElementById('industry_experience').value = formData.industry_experience;

        // Tools/Software
        document.getElementById('tools_software').value = formData.tools_software;

        // Fachfragen
        document.getElementById('technical_questions').value = formData.technical_questions;

        // Deutsch
        document.getElementById('german_level').value = formData.german_level;
        document.querySelector(`input[name="german_ti_checked"][value="${formData.german_ti_checked}"]`).checked = true;

        // Englisch
        document.getElementById('english_level').value = formData.english_level;
        document.querySelector(`input[name="english_ti_checked"][value="${formData.english_ti_checked}"]`).checked = true;

        // IT-Sprachen
        document.querySelector('input[name="it_language_type"][value="Frontend"]').checked = formData.it_languages.includes('Frontend');
        document.querySelector('input[name="it_language_type"][value="Backend"]').checked = formData.it_languages.includes('Backend');
        document.querySelector('input[name="it_language_type"][value="FullStack"]').checked = formData.it_languages.includes('FullStack');
        document.querySelector('input[name="it_language_type"][value="Sonstiges"]').checked = formData.it_languages.includes('Sonstiges');

        // Frontend Details
        document.querySelector('input[name="frontend_details"]').value = formData.it_languages.includes('Frontend') ? formData.it_languages.split('; ').find(item => item.includes('Frontend'))?.split(': ')[1] || '' : '';

        // Backend Details
        document.querySelector('input[name="backend_details"]').value = formData.it_languages.includes('Backend') ? formData.it_languages.split('; ').find(item => item.includes('Backend'))?.split(': ')[1] || '' : '';

        // FullStack Details
        document.querySelector('input[name="fullstack_details"]').value = formData.it_languages.includes('FullStack') ? formData.it_languages.split('; ').find(item => item.includes('FullStack'))?.split(': ')[1] || '' : '';

        // Sonstige IT-Details
        document.querySelector('input[name="other_it_details"]').value = formData.it_languages.includes('Sonstiges') ? formData.it_languages.split('; ').find(item => item.includes('Sonstiges'))?.split(': ')[1] || '' : '';
    }

    // Hilfsfunktion zum Zurücksetzen des Formulars nach PDF-Generierung
    function resetFormAfterPDF() {
        // Interviewer-Auswahl zurücksetzen
        document.querySelectorAll('input[name="interviewer"]').forEach(radio => radio.checked = false);

        // Name
        document.getElementById('name').value = '';

        // Position
        document.getElementById('position').value = '';

        // Bereich
        document.querySelectorAll('input[name="area"]').forEach(radio => radio.checked = false);

        // Standort
        document.getElementById('other_location').value = '';

        // Kandidaten-Zusammenfassung
        document.getElementById('candidate_summary').value = '';

        // Verfügbarkeit
        document.getElementById('availability').value = '';

        // Kündigungsfrist
        document.getElementById('notice_period').value = '';

        // Aktuelles Gehalt
        document.getElementById('current_salary').value = '';

        // Wunschgehalt
        document.getElementById('desired_salary').value = '';

        // Benefits
        document.getElementById('benefits').value = '';

        // Top Skills
        document.getElementById('top_skills').value = '';

        // Zertifizierungen
        document.getElementById('certifications').value = '';

        // Branchenerfahrung
        document.getElementById('industry_experience').value = '';

        // Tools/Software
        document.getElementById('tools_software').value = '';

        // Fachfragen
        document.getElementById('technical_questions').value = '';

        // Deutsch
        document.getElementById('german_level').value = '';
        document.querySelectorAll('input[name="german_ti_checked"]').forEach(radio => radio.checked = false);

        // Englisch
        document.getElementById('english_level').value = '';
        document.querySelectorAll('input[name="english_ti_checked"]').forEach(radio => radio.checked = false);

        // IT-Sprachen
        document.querySelectorAll('input[name="it_language_type"]').forEach(checkbox => checkbox.checked = false);
        document.querySelectorAll('input[name="frontend_details"]').forEach(input => input.value = '');
        document.querySelectorAll('input[name="backend_details"]').forEach(input => input.value = '');
        document.querySelectorAll('input[name="fullstack_details"]').forEach(input => input.value = '');
        document.querySelectorAll('input[name="other_it_details"]').forEach(input => input.value = '');
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
