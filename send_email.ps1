$Subject = "Simply Complex Solutions - Bundle Pitch"
$Body = @"
Hei Anders,<br><br>Vedlagt finner du vårt pitch-dokument for bundle-pakken.<br><br><b>Hovedpunkter:</b><br>
- 50+ n8n automasjonsmaler<br>
- Spar 20+ timer/uka<br>
- 14 dagers gratis prøve<br>
- 30 dagers pengene-tilbake-garanti<br><br>
<b>Priser:</b> $247 - $1,497<br><br>
<b>ROI-kalkulator:</b> https://scs-marketplace.pages.dev/roi-calculator.html<br><br>
Mvh<br>Simply Complex Solutions
"@
$From = "dennnwood@gmail.com"
$To = "andersdj03@outlook.com"
$SMTPServer = "smtp.gmail.com"
$SMTPPort = 587
$Username = "dennnwood@gmail.com"
$Password = "wgpn yalb mmmp xwih"
$SecurePassword = ConvertTo-SecureString $Password -AsPlainText -Force
$Credential = New-Object System.Management.Automation.PSCredential($Username, $SecurePassword)

Send-MailMessage -From $From -To $To -Subject $Subject -Body $Body -BodyAsHtml -SmtpServer $SMTPServer -Port $SMTPPort -UseSsl -Credential $Credential
