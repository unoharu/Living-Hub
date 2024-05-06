import React from 'react';
// "./images/logo.svg"의 경로를 확인하세요. 상대 경로가 프로젝트 구조와 일치하는지 확인이 필요합니다.
import logo from '/images/logo.svg';

function Header() {
    return (
        <header className="header-wrap">
            <div className="header-line1">
                <ul>
                    <li><a href="#">会員登録</a></li>
                    <li><a href="#">ログイン</a></li>
                    <li><a href="#">ヘルプ</a></li>
                </ul>
            </div>
            <div className="header-line2">
                <div className="header-line2-container">
                    <div className="header-title">
                        {/* 로고 이미지 경로가 올바른지 확인하세요 */}
                        <a href="#"><img src={logo} alt=""/></a>
                        <a href="#"><p>LIVING HUB</p></a>
                    </div>
                    <ul>
                        <li><a href="#">ホーム</a></li>
                        <li><a href="#">エリアから探す</a></li>
                        <li><a href="#">お気に入りから探す</a></li>
                    </ul>
                    <div className="header-right"></div>
                </div>
            </div>
        </header>
    );
}

export default Header;
