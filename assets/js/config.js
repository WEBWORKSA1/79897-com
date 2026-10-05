/* =========================================================
   79897.com — SITE CONFIG (edit this file only)
   ========================================================= */
window.SITE = {
  name: "79897",
  domain: "79897.com",
  tagline: "China Trade & Prosperity Hub",

  /* Destination for the interest bar shown at the top of every page */
  interestUrl: "https://web.works/contact",

  /* Form delivery. The inbox is stored only as this encoded array and is decoded
     in memory at submit time. It is never written into the page.
     Do not replace it with a plain address. */
  _k: [106,65,73,69,86,50,44,61,52,109,35,13,28,25,22,234,163,247,244,207],
  formEndpoint: "https://formsubmit.co/ajax/",

  /* Google AdSense. Set your publisher ID (ca-pub-XXXXXXXXXXXXXXXX) and slot IDs.
     While this is still the placeholder, ad slots show "Advertise here" house ads. */
  adsenseClient: "ca-pub-XXXXXXXXXXXXXXXX",
  adSlots: { top: "0000000001", inArticle: "0000000002", sidebar: "0000000003", footer: "0000000004" },

  /* Google Analytics 4 (optional), e.g. "G-XXXXXXXXXX". Loads only after consent. */
  ga4: "",

  /* Donation and support links. Empty links fall back to the pledge form on support.html. */
  donate: {
    paypal: "",        // https://www.paypal.com/donate/?hosted_button_id=XXXX
    stripe: "",        // https://donate.stripe.com/XXXX
    kofi: "",          // https://ko-fi.com/yourname
    buymeacoffee: "",  // https://buymeacoffee.com/yourname
    patreon: "",       // https://patreon.com/yourname
    crypto: ""         // public wallet address
  },

  /* YouTube. Set your channel URL, and swap in your own video IDs as you publish. */
  youtubeChannel: "",
  videos: [
    { id: "j0wgBZOOJY8", title: "Import products from China: beginner's guide, step by step", tag: "import" },
    { id: "kJ9LbCZPt_A", title: "How to import from China without an agent", tag: "import" },
    { id: "tzRBeDKEgP0", title: "How to import from China and save on your goods", tag: "import" },
    { id: "ksNcF8fULK8", title: "Canton Fair 2026: the complete guide", tag: "fairs" },
    { id: "VzDoS31wQ10", title: "Canton Fair: watch this before you go", tag: "fairs" },
    { id: "NhyAh9vOFEw", title: "Guide for Canton Fair overseas buyers", tag: "fairs" },
    { id: "pT52hREAf18", title: "Chinese lucky numbers (Numberphile)", tag: "numbers" },
    { id: "p1aXXPVPqIA", title: "Why is 8 considered lucky in Chinese culture?", tag: "numbers" },
    { id: "sr673iAqLZY", title: "Meanings behind Chinese numbers", tag: "numbers" }
  ],

  social: { youtube: "", linkedin: "", x: "", instagram: "", tiktok: "", facebook: "" },

  /* Fundraising goal shown on the Support page (update by hand) */
  fundraising: { goal: 7989, raised: 0, currency: "USD" }
};
