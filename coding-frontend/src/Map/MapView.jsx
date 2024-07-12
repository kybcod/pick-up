import React, { useEffect, useState } from "react";

export default function MapView() {
    const apiKey = import.meta.env.VITE_API_KEY;
    const [map, setMap] = useState(null);
    const [currentPosition, setCurrentPosition] = useState(null);
    const [foodMarkers, setFoodMarkers] = useState([]);
    const [cafeMarkers, setCafeMarkers] = useState([]);

    useEffect(() => {
        const script = document.createElement("script");
        script.async = true;
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false&libraries=services,clusterer`;
        document.head.appendChild(script);

        script.addEventListener("load", () => {
            window.kakao.maps.load(() => {
                const mapContainer = document.getElementById("map");
                const options = {
                    center: new window.kakao.maps.LatLng(37.5662952, 126.9779451), // Seoul
                    level: 3,
                };
                const newMap = new window.kakao.maps.Map(mapContainer, options);
                setMap(newMap); // Set the map instance in state
            });
        });

        return () => {
            document.head.removeChild(script);
        };
    }, [apiKey]);

    useEffect(() => {
        if (map) {
            // Once map is loaded, fetch current location
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const latitude = position.coords.latitude;
                        const longitude = position.coords.longitude;
                        setCurrentPosition({ latitude, longitude });
                        map.panTo(new window.kakao.maps.LatLng(latitude, longitude)); // Move map to current location
                        setDefaultMarker(latitude, longitude); // Set default marker at current location
                        searchNearbyPlaces(latitude, longitude); // Search nearby places
                    },
                    (error) => {
                        console.error("Error getting current location:", error);
                    }
                );
            } else {
                console.error("Geolocation is not supported by this browser.");
            }
        }
    }, [map]);

    // Function to set default marker at current location
    const setDefaultMarker = (latitude, longitude) => {
        if (!map) return;

        const markerImage = new window.kakao.maps.MarkerImage(
            "https://img.icons8.com/emoji/48/000000/pinching-hand.png",
            new window.kakao.maps.Size(40, 40),
            { offset: new window.kakao.maps.Point(20, 40) }
        );

        const marker = new window.kakao.maps.Marker({
            position: new window.kakao.maps.LatLng(latitude, longitude),
            map: map,
            image: markerImage,
        });
    };

    // Function to search nearby places based on latitude and longitude
    const searchNearbyPlaces = (latitude, longitude) => {
        if (!map) return;

        const ps = new window.kakao.maps.services.Places(map);

        // Category codes for restaurants and cafes
        const categories = ["FD6", "CE7"]; // FD6: 음식점, CE7: 카페

        categories.forEach((categoryCode) => {
            ps.categorySearch(categoryCode, (data, status, pagination) => {
                if (status === window.kakao.maps.services.Status.OK) {
                    const places = data.filter((place) => {
                        const distance = calculateDistance(latitude, longitude, place.y, place.x);
                        return distance <= 10000; // Within 10km radius
                    });
                    displayPlacesOnMap(places, categoryCode);
                } else {
                    console.error("Failed to fetch places:", status);
                }
            }, { location: new window.kakao.maps.LatLng(latitude, longitude), radius: 10000 });
        });
    };

    // Function to display places as markers on the map
    const displayPlacesOnMap = (places, categoryCode) => {
        if (!map) return;

        const markersArray = [];

        places.forEach((place) => {
            const markerImage = getMarkerImage(categoryCode);
            const marker = new window.kakao.maps.Marker({
                position: new window.kakao.maps.LatLng(place.y, place.x),
                map: map,
                image: markerImage,
            });

            markersArray.push(marker);

            // Add click event listener to each marker
            window.kakao.maps.event.addListener(marker, "click", () => {
                displayPlaceInfo(place);
            });
        });

        if (categoryCode === "FD6") {
            setFoodMarkers(markersArray);
        } else if (categoryCode === "CE7") {
            setCafeMarkers(markersArray);
        }
    };

    // Function to calculate distance between two points in meters
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371e3; // metres
        const φ1 = lat1 * (Math.PI / 180);
        const φ2 = lat2 * (Math.PI / 180);
        const Δφ = (lat2 - lat1) * (Math.PI / 180);
        const Δλ = (lon2 - lon1) * (Math.PI / 180);

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = R * c;
        return distance;
    };

    // Function to display place info in a custom overlay
    const displayPlaceInfo = (place) => {
        const content = `<div class="placeinfo">
            <a class="title" href="${place.place_url}" target="_blank">${place.place_name}</a>
            ${place.road_address_name ? `<span>${place.road_address_name}</span>` : `<span>${place.address_name}</span>`}
            <span class="tel">${place.phone}</span>
        </div><div class="after"></div>`;
        const placeOverlay = new window.kakao.maps.CustomOverlay({ zIndex: 1 });
        const contentNode = document.createElement('div');
        contentNode.className = 'placeinfo_wrap';
        contentNode.innerHTML = content;
        placeOverlay.setContent(contentNode);
        placeOverlay.setPosition(new window.kakao.maps.LatLng(place.y, place.x));
        placeOverlay.setMap(map);
    };

    // Function to get marker image based on category code
    const getMarkerImage = (categoryCode) => {
        let imageSrc = "";
        let imageSize = new window.kakao.maps.Size(50, 50); // Marker image size

        if (categoryCode === "FD6") {
            imageSrc = '/img/restaurant.png'; // Food marker image
        } else if (categoryCode === "CE7") {
            imageSrc = '/img/cafe.png'; // Cafe marker image
        } else {
            // Default marker image
            imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png';
            imageSize = new window.kakao.maps.Size(27, 28); // Default size for other markers
        }

        const imgOptions = {
            spriteSize: imageSize, // Use the same size as imageSize
            spriteOrigin: new window.kakao.maps.Point(0, 0), // Start displaying from the top-left corner of the sprite
            offset: new window.kakao.maps.Point(0, 0), // No offset to show the entire image within the 50x50 box
        };

        return new window.kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions);
    };



    // Handler for showing food markers
    const handleShowFoodMarkers = () => {
        if (foodMarkers.length > 0) {
            foodMarkers.forEach(marker => marker.setMap(map));
        }
        if (cafeMarkers.length > 0) {
            cafeMarkers.forEach(marker => marker.setMap(null));
        }
    };

    // Handler for showing cafe markers
    const handleShowCafeMarkers = () => {
        if (cafeMarkers.length > 0) {
            cafeMarkers.forEach(marker => marker.setMap(map));
        }
        if (foodMarkers.length > 0) {
            foodMarkers.forEach(marker => marker.setMap(null));
        }
    };

    // Handler for current location button click
    const handleCurrentLocationClick = () => {
        if (navigator.geolocation && map) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    setCurrentPosition({ latitude, longitude });
                    map.panTo(new window.kakao.maps.LatLng(latitude, longitude)); // Move map to current location
                    setDefaultMarker(latitude, longitude); // Set default marker at current location
                    searchNearbyPlaces(latitude, longitude); // Search nearby places
                },
                (error) => {
                    console.error("Error getting current location:", error);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser or map is not initialized.");
        }
    };

    return (
        <>
            <div>
                <button onClick={handleCurrentLocationClick}>현재 내 위치</button>
                <button onClick={handleShowFoodMarkers}><span role="img" aria-label="Food">🌮</span> 음식점</button>
                <button onClick={handleShowCafeMarkers}><span role="img" aria-label="Cafe">☕</span> 카페</button>
            </div>
            <div id="map" style={{ width: "100%", height: "400px" }}></div>
        </>
    );
}
