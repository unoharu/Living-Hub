import React from 'react';

function Footer() {
  return (
    <footer className="footer-wrap">
        <div>
            <ul className="footer-links">
                <li><a href="#">プライバシーポリシー</a></li>
                <li><a href="#">利用規約</a></li>
                <li>東京都新宿区西新宿1-12-12 モード学園コクーンタワー</li>
            </ul>
            <div className="footer-access">
                <ul>
                    <li>© 2023 Living Hub. All Rights Reserved.</li>
                    <li>お問い合わせ: contact@company.co.jp</li>
                </ul>
            </div>
        </div>
        <ul className="footer-accounts">
            <li><a href="#">YouTube</a></li>
            <li><a href="#">Facebook</a></li>
            <li><a href="#">Instagram</a></li>
        </ul>
    </footer>
  );
}

export default Footer;
