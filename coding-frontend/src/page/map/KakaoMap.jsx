import React, { useEffect } from 'react';

export function KakaoMap({ onLoad, libraries = 'services' }) {
        const apiKey = import.meta.env.VITE_API_KEY;
    useEffect(() => {
        const script = document.createElement("script");
        script.async = true;
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false&libraries=${libraries}`;
        document.head.appendChild(script);

        script.onload = () => {
            window.kakao.maps.load(() => {
                if (onLoad) {
                    onLoad();
                }
            });
        };

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    return null;
}