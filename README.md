# Portfolio Contact Backend

Built with Node.js + Express to handle contact form submissions. When someone messages me through my portfolio, the backend sends me an email notification and automatically replies to them with a confirmation.

## What I Built

**Frontend**: https://bjadhs.github.io  
**Local dev**: http://localhost:5000

### Features
- Contact form on my portfolio site
- Emails come straight to my inbox
- Auto-reply sent to the person who contacted me
- Works locally for testing, works live on GitHub Pages


## API

`POST /api/contact`

Sends:
```json
{
  "name": "John",
  "email": "john@example.com", 
  "subject": "Hello",
  "message": "Want to work together"
}
```

