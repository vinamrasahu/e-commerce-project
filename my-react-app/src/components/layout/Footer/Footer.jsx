export default function FloneFooter() {
  return (
    <footer className="flone-footer">
      <style>{`
        .flone-footer {
          background: #eeeeea;
          padding: 52px 60px 40px;
          font-family: 'Helvetica Neue', Arial, sans-serif;
        }
        .flone-footer .grid {
          display: grid;
          grid-template-columns: 1.1fr 1fr 1fr 1fr 1.3fr;
          gap: 24px;
          text-align: center;
        }
        .flone-footer .col {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        @media (max-width: 900px) {
          .flone-footer { padding: 40px 32px 32px; }
          .flone-footer .grid {
            grid-template-columns: repeat(2, 1fr);
            row-gap: 32px;
          }
        }
        @media (max-width: 520px) {
          .flone-footer { padding: 32px 20px 28px; }
          .flone-footer .grid {
            grid-template-columns: 1fr;
            row-gap: 28px;
          }
        }
      `}</style>

      <div className="grid">
        {/* Brand */}
        <div className="col">
          <div style={{ fontSize: 30, fontWeight: 800, color: "#1a1a1a", marginBottom: 10, letterSpacing: "-0.5px" }}>
            Flone.
          </div>
          <div style={{ fontSize: 13, color: "#444", lineHeight: 1.7 }}>
            © 2023 <span style={{ color: "#7c3aed" }}>Flone.</span><br />
            <span style={{ color: "#7c3aed" }}>All Rights Reserved</span>
          </div>
        </div>

        {/* About Us */}
        <FooterCol title="About Us" links={["About us", "Store location", "Contact", "Orders tracking"]} />

        {/* Useful Links */}
        <FooterCol title="Useful Links" links={["Returns", "Support Policy", "Size guide", "FAQs"]} />

        {/* Follow Us */}
        <FooterCol title="Follow Us" links={["Facebook", "Twitter", "Instagram", "Youtube"]} />

        {/* Subscribe */}
        <div className="col">
          <p style={colTitleStyle}>Subscribe</p>
          <p style={{ fontSize: 12, color: "#666", lineHeight: 1.65, marginBottom: 20 }}>
            Get E-mail updates about our latest shop and special offers.
          </p>
          <p style={{ fontSize: 13, color: "#999", marginBottom: 6, width: "100%" }}>Enter your email here..</p>
          <hr style={{ border: "none", borderTop: "1px solid #aaa", marginBottom: 14, width: "100%" }} />
          <button style={{
            fontSize: 11.5, fontWeight: 700, letterSpacing: "0.1em",
            textTransform: "uppercase", color: "#1a1a1a", background: "none",
            border: "none", cursor: "pointer", textDecoration: "underline",
            textUnderlineOffset: 4, padding: 0
          }}>
            Subscribe
          </button>
        </div>
      </div>
    </footer>
  );
}

const colTitleStyle = {
  fontSize: 11, fontWeight: 700, letterSpacing: "0.13em",
  textTransform: "uppercase", color: "#1a1a1a", marginBottom: 20
};

function FooterCol({ title, links }) {
  return (
    <div className="col">
      <p style={colTitleStyle}>{title}</p>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 13 }}>
        {links.map(link => (
          <li key={link}>
            <a href="#" style={{ fontSize: 13.5, color: "#444", textDecoration: "none" }}>{link}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}