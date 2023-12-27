export default function TestWebmention() {
  return (
    <>
      <div className="h-entry">
        <div className="u-author h-card">
          <img
            src="https://images.ctfassets.net/wc253zohgsra/6ldaNVODgtTNBymgloaY3Z/c36d9234283255a4802cb949b8c0dfad/john_logo.png"
            alt="John Whiles"
            className="u-photo"
            width="40"
          />
          <a href="https://johnwhiles.com/" className="u-url p-name">
            John Whiles
          </a>
        </div>
        <p>
          in reply to:{" "}
          <a
            className="u-in-reply-to"
            href="https://johnwhiles.com/posts/vimming-pains"
          >
            @jwhiles
          </a>
        </p>
        <p className="e-content">
          Testing my webmention endpoint. This is a reply to a post on my site.
        </p>
        <p>
          <a href="http://johnwhiles.com/test_webmention" className="u-url">
            <time className="dt-published" dateTime="2023-12-27:15:00-0700">
              Dec 27, 2023
            </time>
          </a>
        </p>
      </div>
    </>
  );
}
