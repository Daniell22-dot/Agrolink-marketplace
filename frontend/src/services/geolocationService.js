// Geolocation Service
class GeolocationService {
    constructor() {
        this.defaultLocation = {
            latitude: -1.286389, // Nairobi, Kenya
            longitude: 36.817223,
            county: 'Nairobi',
            accuracy: null
        };
    }

    // Get current position
    async getCurrentPosition() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                console.warn('Geolocation not supported, using default location');
                resolve(this.defaultLocation);
                return;
            }

            const options = {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            };

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const locationData = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    };

                    // Get address details from coordinates
                    const address = await this.reverseGeocode(
                        locationData.latitude,
                        locationData.longitude
                    );

                    resolve({ ...locationData, ...address });
                },
                (error) => {
                    console.warn('Geolocation error:', error.message);
                    resolve(this.defaultLocation);
                },
                options
            );
        });
    }

    // Reverse geocode to get address
    async reverseGeocode(latitude, longitude) {
        try {
            // Using Nominatim (OpenStreetMap) - Free
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?` +
                `format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
                {
                    headers: {
                        'User-Agent': 'AgroLink/1.0'
                    }
                }
            );

            const data = await response.json();

            return {
                county: data.address?.county || data.address?.state || 'Unknown',
                subCounty: data.address?.suburb || data.address?.town || '',
                location: data.display_name || `${latitude}, ${longitude}`
            };
        } catch (error) {
            console.error('Reverse geocode error:', error);
            return {
                county: 'Unknown',
                subCounty: '',
                location: `${latitude}, ${longitude}`
            };
        }
    }

    // Calculate distance between two points (in km)
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius in km
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    toRad(degrees) {
        return degrees * (Math.PI / 180);
    }

    // Watch position for real-time updates
    watchPosition(callback) {
        if (!navigator.geolocation) {
            callback(this.defaultLocation);
            return null;
        }

        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

        return navigator.geolocation.watchPosition(
            async (position) => {
                const locationData = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy
                };

                const address = await this.reverseGeocode(
                    locationData.latitude,
                    locationData.longitude
                );

                callback({ ...locationData, ...address });
            },
            (error) => {
                console.warn('Watch position error:', error.message);
                callback(this.defaultLocation);
            },
            options
        );
    }

    // Clear watch
    clearWatch(watchId) {
        if (watchId && navigator.geolocation) {
            navigator.geolocation.clearWatch(watchId);
        }
    }

    // Kenyan Counties list
    getKenyanCounties() {
        return [
            'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Uasin Gishu',
            'Kiambu', 'Machakos', 'Kajiado', 'Murang\'a', 'Nyeri',
            'Meru', 'Embu', 'Tharaka-Nithi', 'Kirinyaga', 'Nyandarua',
            'Laikipia', 'Baringo', 'Elgeyo Marakwet', 'Nandi', 'Kericho',
            'Bomet', 'Kakamega', 'Vihiga', 'Bungoma', 'Busia',
            'Siaya', 'Kisii', 'Nyamira', 'Migori', 'Homa Bay',
            'Turkana', 'West Pokot', 'Samburu', 'Trans Nzoia', 'Narok',
            'Kwale', 'Kilifi', 'Tana River', 'Lamu', 'Taita-Taveta',
            'Garissa', 'Wajir', 'Mandera', 'Marsabit', 'Isiolo',
            'Kitui', 'Makueni'
        ];
    }
}

export default new GeolocationService();
