const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'dennnwood@gmail.com',
        pass: 'wgpn yalb mmmp xwih' // App password
    }
});

const mailOptions = {
    from: 'dennnwood@gmail.com',
    to: 'andersdj03@outlook.com',
    subject: 'Simply Complex Solutions - Terms of Service Documentation',
    html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
                h1 { color: #1a1a2e; border-bottom: 2px solid #6366f1; padding-bottom: 10px; }
                h2 { color: #2d2d44; margin-top: 30px; }
                h3 { color: #4a4a6a; }
                ul { margin-left: 20px; }
                li { margin: 8px 0; }
                .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; }
                .section { background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 10px 0; }
            </style>
        </head>
        <body>
            <h1>📋 Simply Complex Solutions - Terms of Service</h1>
            <p><strong>Sist oppdatert:</strong> 8. februar 2026</p>
            
            <div class="section">
                <h2>1. Akseptanse av vilkår</h2>
                <p>Ved å bruke tjenestene våre godtar du disse vilkårene. Hvis du ikke godtar dem, vennligst ikke bruk tjenestene.</p>
            </div>
            
            <div class="section">
                <h2>2. Beskrivelse av tjenesten</h2>
                <p>Vi leverer enterprise AI-automatisering og relaterte tjenester:</p>
                <ul>
                    <li>Sales Excellence bundle</li>
                    <li>Support Automation bundle</li>
                    <li>Hiring System bundle</li>
                    <li>Oppsett og onboarding</li>
                    <li>Overvåking og dashboard-tilgang</li>
                </ul>
            </div>
            
            <div class="section">
                <h2>3. Brukerkontoer</h2>
                <ul>
                    <li>Du må oppgi korrekt informasjon ved registrering</li>
                    <li>Du er ansvarlig for kontoens sikkerhet</li>
                    <li>Meld fra umiddelbart ved uautorisert bruk</li>
                </ul>
            </div>
            
            <div class="section">
                <h2>4. Akseptabel bruk - FORBUDT:</h2>
                <ul>
                    <li>Ulovlige formål</li>
                    <li>Forstyrre eller hacke tjenestene</li>
                    <li>Spre virus eller skadelig kode</li>
                    <li>Reverse engineering</li>
                    <li>Videreselge uten autorisasjon</li>
                    <li>Behandle data for ulovlige aktiviteter</li>
                </ul>
            </div>
            
            <div class="section">
                <h2>5. Abonnement og betaling</h2>
                <ul>
                    <li><strong>Fakturering:</strong> Månedlig eller årlig</li>
                    <li><strong>Prisendringer:</strong> Varsles før neste faktureringsperiode</li>
                    <li><strong>Refusjon:</strong> 30-dagers pengene-tilbake-garanti for nye kunder</li>
                </ul>
            </div>
            
            <div class="section">
                <h2>6. Kansellering</h2>
                <p>Du kan kansellere når som helst. Kansellering trer i kraft ved slutten av gjeldende faktureringsperiode. Ingen refusjon for delvis perioder.</p>
            </div>
            
            <div class="section">
                <h2>7. Service Level Agreement</h2>
                <p>Vi streber etter 99,9% oppetid.</p>
            </div>
            
            <div class="section">
                <h2>8. Immaterielle rettigheter</h2>
                <p>Alt innhold eies av oss. Du eier dine egne data.</p>
            </div>
            
            <div class="section">
                <h2>10. Ansvarsbegrensning</h2>
                <ul>
                    <li>Ikke ansvarlig for indirekte skader</li>
                    <li>Maksimalt ansvar: det du har betalt de siste 12 månedene</li>
                </ul>
            </div>
            
            <div class="section">
                <h2>11. Garantier</h2>
                <p>Tjenestene leveres "som de er" - ingen garantier utover dette.</p>
            </div>
            
            <div class="section">
                <h2>15. Lovvalg</h2>
                <p>California, USA</p>
            </div>
            
            <div class="section">
                <h2>20. Kontakt</h2>
                <ul>
                    <li><strong>Email:</strong> legal@simplycomplex.io</li>
                    <li><strong>Adresse:</strong> 123 Innovation Drive, San Francisco, CA 94107</li>
                </ul>
            </div>
            
            <div class="footer">
                <p><strong>Lenker:</strong></p>
                <p>🌐 <a href="https://scs-marketplace.pages.dev/">Nettside</a> | 
                   🔒 <a href="https://scs-marketplace.pages.dev/privacy.html">Privacy Policy</a> | 
                   🍪 <a href="https://scs-marketplace.pages.dev/cookies.html">Cookies Policy</a></p>
            </div>
        </body>
        </html>
    `
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log('Error:', error.message);
    } else {
        console.log('Email sent:', info.response);
    }
});
