const UPDATED = 'November 7, 2026';
const REPO = 'https://github.com/CharlieRusso001/QuantMemorization';
const ISSUES = `${REPO}/issues`;

const Contact = () => (
  <a href={ISSUES} target="_blank" rel="noopener noreferrer">
    the project's GitHub Issues page
  </a>
);

function Privacy() {
  return (
    <>
      <h2>Privacy Policy</h2>
      <p className="updated">Last updated: {UPDATED}</p>

      <p>
        Quant Memorization ("the app", "we") is a free practice tool. We built it to collect as little as possible. This
        policy explains what that means.
      </p>

      <h3>What we collect</h3>
      <p>
        <b>Nothing that identifies you.</b> There are no accounts, sign-ups, ads, analytics or tracking scripts, and the
        app sets no cookies.
      </p>

      <h3>What is stored on your device</h3>
      <p>
        When you finish an exam, a short summary is saved in your browser's <i>local storage</i>: the mode, the date and
        time, how many questions you answered and got right, and your timing. Only your own browser uses it, to draw your
        Stats chart. It is <b>never sent to us</b> or anyone else, and it does not sync between devices.
      </p>
      <p>
        To delete it, use <b>Stats → Clear history</b>, or clear this site's data in your browser settings. Private or
        incognito windows usually delete it when you close them.
      </p>

      <h3>Hosting</h3>
      <p>
        The app is hosted on Vercel. As with any website, Vercel's servers receive basic technical information when your
        browser loads the page, such as your IP address, browser type and the page requested. They use it to deliver the
        site and protect it from abuse. We don't use this information to identify you. See{' '}
        <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
          Vercel's Privacy Policy
        </a>{' '}
        for how they handle it.
      </p>

      <h3>Monotreme badge</h3>
      <p>
        The "By Monotreme" badge at the bottom of each page is loaded from{' '}
        <a href="https://monotreme.dev" target="_blank" rel="noopener noreferrer">
          monotreme.dev
        </a>
        . Loading it means your browser contacts that server, which receives the same kind of basic request information
        described above. The badge script only draws the logo and link. It does not set cookies or read your exam data.
      </p>

      <h3>Sharing links</h3>
      <p>
        When you share a link to the app in a messaging app (for example SMS/iMessage, Snapchat or Discord), that service
        may fetch the page title and preview image to show a preview. That request comes from the messaging service and
        is governed by its privacy policy.
      </p>

      <h3>Children</h3>
      <p>
        The app does not knowingly collect personal information from anyone, including children under 13, because it
        doesn't collect personal information at all.
      </p>

      <h3>Changes</h3>
      <p>If this policy changes, we will update this page and the date above.</p>

      <h3>Contact</h3>
      <p>
        Questions about privacy? Open an issue on <Contact />.
      </p>
    </>
  );
}

function Terms() {
  return (
    <>
      <h2>Terms of Service</h2>
      <p className="updated">Last updated: {UPDATED}</p>

      <p>By using Quant Memorization ("the app"), you agree to these terms. If you don't agree, please don't use the app.</p>

      <h3>What the app is</h3>
      <p>
        A free educational tool for practicing mental math and basic probability. It is for study and practice only. It
        is <b>not</b> financial, investment, academic or professional advice, and using it doesn't guarantee any result,
        including on an exam or in an interview.
      </p>

      <h3>Accuracy</h3>
      <p>
        We try to make every question and answer correct, but mistakes are possible. If you find an error, please report
        it on <Contact />.
      </p>

      <h3>Acceptable use</h3>
      <p>Please don't:</p>
      <ul>
        <li>try to disrupt, overload or attack the site or its hosting;</li>
        <li>use the app for anything unlawful;</li>
        <li>misrepresent the app or claim it is your own service.</li>
      </ul>

      <h3>Your data</h3>
      <p>
        Your exam history is stored only in your browser (see the <a href="#/privacy">Privacy Policy</a>). We can't
        recover it if it is cleared or lost.
      </p>

      <h3>Open source</h3>
      <p>
        The app's source code is available under the{' '}
        <a href={`${REPO}/blob/main/LICENSE`} target="_blank" rel="noopener noreferrer">
          MIT License
        </a>
        . That license governs your use of the code. These terms govern your use of this hosted website.
      </p>

      <h3>No warranty</h3>
      <p>
        The app is provided <b>"as is" and "as available"</b>, without warranties of any kind, express or implied. That
        includes warranties of merchantability, fitness for a particular purpose, accuracy and uninterrupted
        availability.
      </p>

      <h3>Limitation of liability</h3>
      <p>
        To the fullest extent permitted by law, the app's creators are not liable for any indirect, incidental, special,
        consequential or punitive damages, or any loss of data, arising from your use of the app or your inability to use
        it.
      </p>

      <h3>Changes</h3>
      <p>
        We may update these terms or change or discontinue the app at any time. Continuing to use the app after a change
        means you accept the updated terms.
      </p>

      <h3>Contact</h3>
      <p>
        Questions? Open an issue on <Contact />.
      </p>
    </>
  );
}

function Accessibility() {
  return (
    <>
      <h2>Accessibility Statement</h2>
      <p className="updated">Last updated: {UPDATED}</p>

      <p>
        We want Quant Memorization to be usable by everyone. We aim to meet the{' '}
        <a href="https://www.w3.org/TR/WCAG21/" target="_blank" rel="noopener noreferrer">
          Web Content Accessibility Guidelines (WCAG) 2.1
        </a>{' '}
        at Level AA.
      </p>

      <h3>What we've done</h3>
      <ul>
        <li>
          <b>Keyboard use:</b> everything works without a mouse. The answer box gets focus automatically, Enter submits,
          and focused controls show a clear outline.
        </li>
        <li>
          <b>Screen readers:</b> form fields have labels, buttons have text, and answer feedback is announced when it
          appears.
        </li>
        <li>
          <b>Not color alone:</b> right and wrong answers are marked with ✓ and ✗ and the words "Correct" and "Wrong", not
          just green and red.
        </li>
        <li>
          <b>Contrast:</b> text meets WCAG AA contrast ratios against its background.
        </li>
        <li>
          <b>Charts:</b> every time chart has a "Show as table" option with the same data.
        </li>
        <li>
          <b>No time limits:</b> the app measures how long you take, but never rushes you or cuts a question off.
        </li>
        <li>
          <b>Zoom and small screens:</b> the layout adapts to phone widths and to browser zoom up to 400%.
        </li>
      </ul>

      <h3>Known limitations</h3>
      <ul>
        <li>The chart's hover details need a mouse. The same information is in the table view.</li>
        <li>There is no dark mode yet. You can use your browser's or operating system's high-contrast settings.</li>
        <li>Math symbols such as × and ÷ depend on your screen reader's symbol settings to be read aloud correctly.</li>
      </ul>

      <h3>Feedback</h3>
      <p>
        If something is hard to use, please tell us on <Contact /> and describe what you were trying to do and what
        assistive technology you use, if any. We'll do our best to fix it.
      </p>
    </>
  );
}

export const LEGAL_PAGES = {
  '#/privacy': { title: 'Privacy Policy', Page: Privacy },
  '#/terms': { title: 'Terms of Service', Page: Terms },
  '#/accessibility': { title: 'Accessibility', Page: Accessibility },
};

export default function Legal({ route }) {
  const { Page } = LEGAL_PAGES[route];
  return (
    <article className="card legal">
      <Page />
    </article>
  );
}
