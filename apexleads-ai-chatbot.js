// ApexLeads AI Chatbot (Basic JS)
(function() {
  const pages = {
    home: { name: "Home", url: "index.html" },
    services: { name: "Services", url: "services.html" },
    pricing: { name: "Pricing", url: "pricing.html" },
    about: { name: "About", url: "about.html" },
    contact: { name: "Contact", url: "enquiry-form.html" },
    testimonials: { name: "Testimonials", url: "testimonials.html" },
    resources: { name: "Resources", url: "resources.html" },
    book: { name: "Book a Call", url: "book-call.html" },
    case: { name: "Case Studies", url: "case-studies.html" }
  };

  function getBotReply(input) {
    const text = input.toLowerCase();
    if (text.includes("service")) return `You can view all our services <a href='services.html'>here</a>.`;
    if (text.includes("price") || text.includes("cost")) return `See our pricing <a href='pricing.html'>here</a>.`;
    if (text.includes("about")) return `Learn more about us <a href='about.html'>here</a>.`;
    if (text.includes("contact") || text.includes("email")) return `You can contact us <a href='enquiry-form.html'>here</a> or email apexleadsanalytics@outlook.com.`;
    if (text.includes("testimonial")) return `Read our testimonials <a href='testimonials.html'>here</a>.`;
    if (text.includes("resource")) return `See our resources <a href='resources.html'>here</a>.`;
    if (text.includes("book")) return `Book a call <a href='book-call.html'>here</a>.`;
    if (text.includes("case")) return `See our case studies <a href='case-studies.html'>here</a>.`;
    if (text.includes("hi") || text.includes("hello") || text.includes("hey")) return `Hello! How can I help you today?`;
    if (text.includes("help")) return `I'm here to help! Ask me about our services, pricing, or anything else.`;
    return `I'm ApexLeads AI. Please tell me what you need help with, or ask about our <a href='services.html'>services</a>, <a href='pricing.html'>pricing</a>, or <a href='enquiry-form.html'>contact</a>.`;
  }

  function createChatbot() {
    // Chatbot container
    const bot = document.createElement('div');
    bot.id = 'apexleads-ai-chatbot';
    bot.style.display = 'none';
    bot.innerHTML = `
      <div id="apexleads-ai-header">ApexLeads AI</div>
      <div id="apexleads-ai-messages"></div>
      <div id="apexleads-ai-input-row">
        <input id="apexleads-ai-input" type="text" placeholder="Type your question..." autocomplete="off" />
        <button id="apexleads-ai-send">Send</button>
      </div>
    `;
    document.body.appendChild(bot);

    // Toggle button
    const toggle = document.createElement('button');
    toggle.id = 'apexleads-ai-toggle';
    toggle.innerHTML = '<span>💬</span>';
    document.body.appendChild(toggle);

    toggle.onclick = function() {
      bot.style.display = bot.style.display === 'none' ? 'flex' : 'none';
    };

    // Message area
    const messages = bot.querySelector('#apexleads-ai-messages');
    function addMsg(text, sender) {
      const msg = document.createElement('div');
      msg.className = 'apexleads-ai-msg ' + sender;
      msg.innerHTML = text;
      messages.appendChild(msg);
      messages.scrollTop = messages.scrollHeight;
    }

    // Initial greeting
    addMsg("Hi! I'm <b>ApexLeads AI</b>. How can I help you today?", 'bot');

    // Input
    const input = bot.querySelector('#apexleads-ai-input');
    const sendBtn = bot.querySelector('#apexleads-ai-send');
    function sendUserMsg() {
      const val = input.value.trim();
      if (!val) return;
      addMsg(val, 'user');
      setTimeout(() => {
        addMsg(getBotReply(val), 'bot');
      }, 400);
      input.value = '';
    }
    sendBtn.onclick = sendUserMsg;
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') sendUserMsg();
    });
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createChatbot);
  } else {
    createChatbot();
  }
})();
