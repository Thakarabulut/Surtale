// Surtale - Mobil Uygulama JavaScript

class SurtaleApp {
    constructor() {
        this.trendingItems = [];
        this.confessions = [];
        this.currentTab = 'aktuel';
        this.currentBedstePage = 1;
        this.totalBedstePages = 8;
        this.currentEdstePage = 1;
        this.totalEdstePages = 9;
        this.init();
    }

    init() {
        this.applyTheme();
        this.bindEvents();
        this.loadSampleData();
        this.renderGundemItems();
    }

    // Tema ayarları - sadece açık tema
    applyTheme() {
        const body = document.body;
        body.className = 'light-theme';
    }

    bindEvents() {
        // Tab değiştirme
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const tabName = e.currentTarget.dataset.tab;
                console.log('Tab clicked:', tabName);
                this.switchTab(tabName);
            });
        });

        // Bottom navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                this.switchPage(e.currentTarget.dataset.page);
            });
        });

        // Header notification icon
        document.getElementById('notificationIcon').addEventListener('click', () => {
            this.showNotificationsPage();
        });

        // Surtale logo click
        document.querySelector('[data-page="surtale-nav"]').addEventListener('click', () => {
            if (document.body.classList.contains('dark-theme')) {
                this.deactivateDarkMode();
            } else {
                this.showDarkModePopup();
            }
        });

        // Dark mode continue button
        document.getElementById('darkModeContinueBtn').addEventListener('click', () => {
            this.activateDarkMode();
        });

        // Dark mode popup overlay click to close
        document.getElementById('darkModeOverlay').addEventListener('click', (e) => {
            if (e.target.id === 'darkModeOverlay') {
                this.hideDarkModePopup();
            }
        });

        // Dark mode kort story click
        const kortStory = document.querySelector('.dark-mode-story');
        if (kortStory) {
            kortStory.addEventListener('click', () => {
                if (document.body.classList.contains('dark-theme')) {
                    this.showMapPage();
                }
            });
        }

        // Story tıklamaları
        document.getElementById('confessionStory1').addEventListener('click', () => {
            this.showEdstePage();
        });

        document.getElementById('confessionStory2').addEventListener('click', () => {
            this.showConfessionModal();
        });


        // FAB butonu
        document.getElementById('fabButton').addEventListener('click', () => {
            this.showConfessionModal();
        });

        // Modal kapatma
        document.querySelector('.close-modal').addEventListener('click', () => {
            this.hideConfessionModal();
        });

        document.querySelector('.btn-cancel').addEventListener('click', () => {
            this.hideConfessionModal();
        });

        // Modal dışına tıklama
        document.getElementById('confessionModal').addEventListener('click', (e) => {
            if (e.target.id === 'confessionModal') {
                this.hideConfessionModal();
            }
        });

        // Confession form gönderme
        document.getElementById('confessionForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitConfession();
        });

        // Trending item tıklamaları
        document.getElementById('trendingList').addEventListener('click', (e) => {
            const item = e.target.closest('.trending-item');
            if (item) {
                this.handleTrendingItemClick(item);
            }
        });

        // Filtreleme seçenekleri
        document.querySelectorAll('.filter-option select').forEach(select => {
            select.addEventListener('change', (e) => {
                this.handleFilterChange(e.target.value);
            });
        });

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        // Perfect search button
        const perfectSearch = document.querySelector('.perfect-search');
        if (perfectSearch) {
            perfectSearch.addEventListener('click', () => {
                const searchValue = document.getElementById('searchInput').value;
                this.handleSearch(searchValue);
            });
        }

        // Hashtag clicks
        document.querySelectorAll('.hashtag-item').forEach(item => {
            item.addEventListener('click', () => {
                const hashtag = item.textContent;
                document.getElementById('searchInput').value = hashtag;
                this.handleSearch(hashtag);
            });
        });

        // Search page logo click - return to home
        const searchLogo = document.querySelector('.search-logo');
        if (searchLogo) {
            searchLogo.addEventListener('click', () => {
                this.showHomePage();
            });
        }

        // Profile tabs
        document.querySelectorAll('.profile-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                // Remove active class from all tabs
                document.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('active'));
                // Add active class to clicked tab
                e.target.classList.add('active');
                
                const tabName = e.target.dataset.tab;
                this.switchProfileTab(tabName);
            });
        });

        // Edste page back button
        document.getElementById('edsteBackBtn').addEventListener('click', () => {
            this.showHomePage();
        });

        // Edste navigation buttons
        for (let i = 1; i <= 9; i++) {
            // Next buttons
            const nextBtn = document.getElementById(`edsteNextBtn${i}`);
            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    this.nextEdstePage();
                });
            }

            // Previous buttons
            const prevBtn = document.getElementById(`edstePrevBtn${i}`);
            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    this.prevEdstePage();
                });
            }

            // Back buttons
            const backBtn = document.getElementById(`edsteBackBtn${i === 1 ? '' : i}`);
            if (backBtn) {
                backBtn.addEventListener('click', () => {
                    this.showHomePage();
                });
            }
        }

        // Bedste page back button
        document.getElementById('bedsteBackBtn').addEventListener('click', () => {
            this.showHomePage();
        });

        // Edste overlay click to close
        document.getElementById('edsteOverlay').addEventListener('click', (e) => {
            if (e.target.id === 'edsteOverlay') {
                this.showHomePage();
            }
        });

        // Bedste overlay click to close
        document.getElementById('bedsteOverlay').addEventListener('click', (e) => {
            if (e.target.id === 'bedsteOverlay') {
                this.showHomePage();
            }
        });

        // Bedste navigation buttons
        for (let i = 1; i <= 8; i++) {
            // Next buttons
            const nextBtn = document.getElementById(`bedsteNextBtn${i}`);
            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    this.nextBedstePage();
                });
            }

            // Previous buttons
            const prevBtn = document.getElementById(`bedstePrevBtn${i}`);
            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    this.prevBedstePage();
                });
            }

            // Back buttons
            const backBtn = document.getElementById(`bedsteBackBtn${i === 1 ? '' : i}`);
            if (backBtn) {
                backBtn.addEventListener('click', () => {
                    this.showHomePage();
                });
            }
        }
    }

    switchTab(tabName) {
        console.log('Switching to tab:', tabName);
        
        // Tab görünümünü güncelle
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
            // Tüm filtre seçeneklerini gizle
            const filter = tab.querySelector('.filter-option');
            if (filter) {
                filter.style.display = 'none';
            }
        });
        
        const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
            
            // Filtre seçeneklerini hiç gösterme
            const activeFilter = activeTab.querySelector('.filter-option');
            if (activeFilter) {
                activeFilter.style.display = 'none';
            }
        }
        
        this.currentTab = tabName;
        
        // İçeriği güncelle
        this.updateContent();
    }

    switchPage(pageName) {
        // Bottom nav görünümünü güncelle
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-page="${pageName}"]`).classList.add('active');
        
        // Sayfa değişimi
        if (pageName === 'messages') {
            this.showMessagesPage();
        } else if (pageName === 'notifications') {
            this.showNotificationsPage();
        } else if (pageName === 'home') {
            this.showHomePage();
        } else if (pageName === 'search') {
            this.showSearchPage();
        } else if (pageName === 'profile') {
            this.showProfilePage();
        } else {
            this.hideAllPages();
        }
        
        console.log(`Switching to ${pageName} page`);
    }

    showMessagesPage() {
        this.hideAllPages();
        document.getElementById('messagesPage').style.display = 'flex';
    }

    hideMessagesPage() {
        document.getElementById('messagesPage').style.display = 'none';
        document.querySelector('.combined-section').style.display = 'block';
    }

    showNotificationsPage() {
        this.hideAllPages();
        document.getElementById('notificationsPage').style.display = 'flex';
    }

    showHomePage() {
        this.hideAllPages();
        document.querySelector('.combined-section').style.display = 'block';
    }

    showEdstePage() {
        this.hideAllPages();
        this.currentEdstePage = 1;
        this.showCurrentEdstePage();
        document.getElementById('edsteOverlay').style.display = 'flex';
        document.body.classList.add('edste-page-open');
        console.log('Edste page shown');
    }

    showCurrentEdstePage() {
        // Hide all pages
        for (let i = 1; i <= 9; i++) {
            document.getElementById(`edstePage${i}`).style.display = 'none';
        }
        
        // Show current page
        document.getElementById(`edstePage${this.currentEdstePage}`).style.display = 'flex';
        
        // Update navigation buttons visibility
        this.updateEdsteNavigation();
    }

    nextEdstePage() {
        if (this.currentEdstePage < 9) {
            this.currentEdstePage++;
            this.showCurrentEdstePage();
        }
    }

    prevEdstePage() {
        if (this.currentEdstePage > 1) {
            this.currentEdstePage--;
            this.showCurrentEdstePage();
        }
    }

    updateEdsteNavigation() {
        // Update all page numbers
        for (let i = 1; i <= 9; i++) {
            const pageNumber = document.querySelector(`#edstePage${i} .edste-page-number`);
            if (pageNumber) {
                pageNumber.textContent = `${i}/9`;
            }
        }

        // Update navigation buttons visibility for current page
        const currentPage = document.getElementById(`edstePage${this.currentEdstePage}`);
        
        // Previous button
        const prevBtn = currentPage.querySelector('.edste-side-prev');
        if (prevBtn) {
            prevBtn.style.display = this.currentEdstePage === 1 ? 'none' : 'flex';
        }

        // Next button
        const nextBtn = currentPage.querySelector('.edste-side-next');
        if (nextBtn) {
            nextBtn.style.display = this.currentEdstePage === 9 ? 'none' : 'flex';
        }
    }

    showBedstePage() {
        this.hideAllPages();
        this.currentBedstePage = 1;
        this.showCurrentBedstePage();
        document.getElementById('bedsteOverlay').style.display = 'flex';
        console.log('Bedste page shown');
    }

    showCurrentBedstePage() {
        // Hide all pages
        for (let i = 1; i <= 8; i++) {
            document.getElementById(`bedstePage${i}`).style.display = 'none';
        }
        
        // Show current page
        document.getElementById(`bedstePage${this.currentBedstePage}`).style.display = 'flex';
        
        // Update navigation buttons visibility
        this.updateBedsteNavigation();
    }

    nextBedstePage() {
        if (this.currentBedstePage < this.totalBedstePages) {
            this.currentBedstePage++;
            this.showCurrentBedstePage();
        }
    }

    prevBedstePage() {
        if (this.currentBedstePage > 1) {
            this.currentBedstePage--;
            this.showCurrentBedstePage();
        }
    }

    updateBedsteNavigation() {
        // Update all page numbers
        for (let i = 1; i <= 8; i++) {
            const pageNumber = document.querySelector(`#bedstePage${i} .bedste-page-number`);
            if (pageNumber) {
                pageNumber.textContent = `${i}/8`;
            }
        }

        // Update navigation buttons visibility for current page
        const currentPage = document.getElementById(`bedstePage${this.currentBedstePage}`);
        
        // Previous button
        const prevBtn = currentPage.querySelector('.bedste-side-prev');
        if (prevBtn) {
            prevBtn.style.display = this.currentBedstePage === 1 ? 'none' : 'flex';
        }

        // Next button
        const nextBtn = currentPage.querySelector('.bedste-side-next');
        if (nextBtn) {
            nextBtn.style.display = this.currentBedstePage === this.totalBedstePages ? 'none' : 'flex';
        }
    }

    showMapPage() {
        this.hideAllPages();
        document.getElementById('mapPage').style.display = 'block';
        
        // Initialize map if not already initialized
        if (!this.map) {
            this.initializeMap();
        }
    }

    showSearchPage() {
        this.hideAllPages();
        document.getElementById('searchPage').style.display = 'block';
        
        // Arama sonuçlarını temizle
        document.getElementById('searchResults').style.display = 'none';
        document.getElementById('searchInput').value = '';
    }

    showProfilePage() {
        this.hideAllPages();
        document.getElementById('profilePage').style.display = 'block';
    }

    initializeMap() {
        console.log('Initializing map...');
        
        // Leaflet yüklü mü kontrol et
        if (typeof L === 'undefined') {
            console.error('Leaflet library not loaded!');
            // Fallback: basit harita placeholder
            this.showMapPlaceholder();
            return;
        }
        
        // Kopenhag koordinatları
        const copenhagen = [55.6761, 12.5683];
        
        try {
            // Haritayı oluştur
            this.map = L.map('leaflet-map').setView(copenhagen, 12);
            console.log('Map created successfully');
            
            // OpenStreetMap tile layer ekle
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 18
            }).addTo(this.map);
            console.log('Tile layer added');
        } catch (error) {
            console.error('Error creating map:', error);
        }
        
        // Kullanıcı konumları
        const userLocations = [
            // Kopenhag merkez
            { lat: 55.6761, lng: 12.5683, type: 'flame', user: 'Anon#432', content: 'den industrielle eevolution og dens asgdghasdadsds' },
            { lat: 55.6804, lng: 12.5775, type: 'skull', user: 'Anon#156', content: 'hvad sker der i københavn i dag?' },
            { lat: 55.6718, lng: 12.5615, type: 'flame', user: 'Anon#789', content: 'nogen der ved hvor man kan få god pizza?' },
            
            // Nørrebro
            { lat: 55.6939, lng: 12.5474, type: 'skull', user: 'Anon#234', content: 'nørrebro er det bedste sted i kbh' },
            { lat: 55.6901, lng: 12.5512, type: 'flame', user: 'Anon#567', content: 'superkilen er så fedt' },
            
            // Østerbro
            { lat: 55.7000, lng: 12.5800, type: 'skull', user: 'Anon#890', content: 'østerbro er for dyrt' },
            { lat: 55.6950, lng: 12.5750, type: 'flame', user: 'Anon#123', content: 'fælledparken er perfekt til løb' },
            
            // Vesterbro
            { lat: 55.6700, lng: 12.5500, type: 'skull', user: 'Anon#456', content: 'vesterbro har de bedste barer' },
            { lat: 55.6650, lng: 12.5450, type: 'flame', user: 'Anon#789', content: 'meatpacking district er awesome' },
            
            // Frederiksberg
            { lat: 55.6800, lng: 12.5300, type: 'skull', user: 'Anon#321', content: 'frederiksberg have er så smuk' }
        ];
        
        // Custom icon oluştur
        const flameIcon = L.divIcon({
            className: 'custom-flame-icon',
            html: '<div style="font-size: 20px; color: #ff6b35; text-shadow: 0 0 10px rgba(255, 107, 53, 0.8);">🔥</div>',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });

        const skullIcon = L.divIcon({
            className: 'custom-skull-icon',
            html: '<div style="width: 20px; height: 20px; background-image: url(\'harita-icon.png\'); background-size: contain; background-repeat: no-repeat; background-position: center; filter: drop-shadow(0 0 8px rgba(244, 67, 54, 0.8));"></div>',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });

        // Marker'ları ekle
        userLocations.forEach(location => {
            const marker = L.marker([location.lat, location.lng], {
                icon: location.type === 'flame' ? flameIcon : skullIcon
            }).addTo(this.map);
            
            // Popup ekle
            marker.bindPopup(`
                <div style="color: #fff; font-family: Arial, sans-serif;">
                    <strong>${location.user}</strong><br>
                    <span style="color: #ccc; font-size: 12px;">${location.content}</span>
                </div>
            `);
            
            // Click event
            marker.on('click', () => {
                console.log(`Clicked on ${location.user} at ${location.lat}, ${location.lng}`);
            });
        });
        
        // Harita boyutunu ayarla
        setTimeout(() => {
            if (this.map) {
                this.map.invalidateSize();
                console.log('Map size invalidated');
            }
        }, 500);
    }

    showMapPlaceholder() {
        const mapContainer = document.getElementById('leaflet-map');
        mapContainer.innerHTML = `
            <div style="
                width: 100%; 
                height: 400px; 
                background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: #fff;
                border-radius: 12px;
                position: relative;
                border: 1px solid #333;
            ">
                <div style="font-size: 24px; margin-bottom: 20px;">🗺️</div>
                <div style="font-size: 18px; margin-bottom: 10px;">København Haritası</div>
                <div style="font-size: 14px; color: #ccc; text-align: center; max-width: 300px;">
                    Harita yükleniyor...<br>
                    İnternet bağlantınızı kontrol edin.
                </div>
                
                <!-- Basit kullanıcı konumları -->
                <div style="position: absolute; top: 50px; left: 50px; font-size: 20px; color: #ff6b35; text-shadow: 0 0 10px rgba(255, 107, 53, 0.8);">🔥</div>
                <div style="position: absolute; top: 80px; left: 80px; width: 20px; height: 20px; background-image: url('harita-icon.png'); background-size: contain; background-repeat: no-repeat; background-position: center; filter: drop-shadow(0 0 8px rgba(244, 67, 54, 0.8));"></div>
                <div style="position: absolute; top: 120px; left: 60px; font-size: 20px; color: #ff6b35; text-shadow: 0 0 10px rgba(255, 107, 53, 0.8);">🔥</div>
                <div style="position: absolute; top: 150px; left: 100px; width: 20px; height: 20px; background-image: url('harita-icon.png'); background-size: contain; background-repeat: no-repeat; background-position: center; filter: drop-shadow(0 0 8px rgba(244, 67, 54, 0.8));"></div>
                <div style="position: absolute; top: 180px; left: 40px; font-size: 20px; color: #ff6b35; text-shadow: 0 0 10px rgba(255, 107, 53, 0.8);">🔥</div>
            </div>
        `;
    }

    hideAllPages() {
        document.getElementById('messagesPage').style.display = 'none';
        document.getElementById('notificationsPage').style.display = 'none';
        document.getElementById('mapPage').style.display = 'none';
        document.getElementById('searchPage').style.display = 'none';
        document.getElementById('profilePage').style.display = 'none';
        document.getElementById('bedsteOverlay').style.display = 'none';
        document.getElementById('edsteOverlay').style.display = 'none';
        document.body.classList.remove('edste-page-open');
    }

    showDarkModePopup() {
        // Bottom navigation'ı bulanıklaştır
        document.body.classList.add('dark-mode-transition');
        
        document.getElementById('darkModeOverlay').style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    activateDarkMode() {
        // Popup'ı kapat
        document.getElementById('darkModeOverlay').style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Bottom navigation bulanıklığını kaldır
        document.body.classList.remove('dark-mode-transition');
        
        // Dark theme'i aktif et
        document.body.className = 'dark-theme';
        
        // Surtale nav'ı aktif yap
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector('[data-page="surtale-nav"]').classList.add('active');
        
        console.log('Dark mode activated');
    }

    deactivateDarkMode() {
        // Light theme'e geri dön
        document.body.className = 'light-theme';
        
        // Home nav'ı aktif yap
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector('[data-page="home"]').classList.add('active');
        
        // Ana sayfayı göster
        this.showHomePage();
        
        console.log('Dark mode deactivated');
    }

    showConfessionModal() {
        document.getElementById('confessionModal').classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    hideConfessionModal() {
        document.getElementById('confessionModal').classList.remove('show');
        document.body.style.overflow = 'auto';
        document.getElementById('confessionText').value = '';
    }

    hideDarkModePopup() {
        document.getElementById('darkModeOverlay').style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Bottom navigation bulanıklığını kaldır
        document.body.classList.remove('dark-mode-transition');
    }

    submitConfession() {
        const text = document.getElementById('confessionText').value.trim();
        
        if (!text) return;

        const confession = {
            id: Date.now(),
            text: text,
            date: new Date(),
            likes: 0
        };

        this.confessions.unshift(confession);
        this.hideConfessionModal();
        
        // Başarı mesajı
        this.showNotification('Bekendelse sendt!');
    }

    handleTrendingItemClick(item) {
        const text = item.querySelector('.trending-text').textContent;
        const username = item.querySelector('.trending-username')?.textContent || 'user214563123';
        const count = item.querySelector('.trending-count').textContent;
        
        console.log(`Clicked on: ${text}`);
        
        // Detay sayfasını göster
        this.showDetailPage(text, username, count);
    }

    updateContent() {
        console.log('Updating content for tab:', this.currentTab);
        
        // Tab'a göre içeriği güncelle
        switch(this.currentTab) {
            case 'aktuel':
                console.log('Rendering aktuel content');
                this.scrollToPopularSection();
                this.renderGundemItems();
                break;
            case 'folger':
                console.log('Rendering folger content');
                this.renderTakipItems();
                break;
            case 'hashtags':
                console.log('Rendering hashtags content');
                this.renderHashtagItems();
                break;
            default:
                console.log('Unknown tab:', this.currentTab);
        }
    }

    scrollToPopularSection() {
        // Populært bölümüne scroll yap
        const popularSection = document.querySelector('.section-header h2');
        if (popularSection) {
            popularSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    renderGundemItems() {
        // Başlığı geri değiştir
        const sectionHeader = document.querySelector('.section-header h2');
        if (sectionHeader) {
            sectionHeader.textContent = 'populært';
        }

        const container = document.getElementById('trendingList');
        container.innerHTML = '';

        this.trendingItems.forEach(item => {
            const div = document.createElement('div');
            div.className = 'trending-item';
            div.innerHTML = `
                <div class="trending-text">${item.text}</div>
                <div class="trending-count">${item.count}</div>
            `;
            container.appendChild(div);
        });
    }

    renderTakipItems() {
        // Başlığı değiştir
        const sectionHeader = document.querySelector('.section-header h2');
        if (sectionHeader) {
            sectionHeader.textContent = 'følger';
        }

        const container = document.getElementById('trendingList');
        container.innerHTML = '';

        const takipItems = [
            { text: "den industrielle eevolution og dens asgdghasdadsds", username: "ahmet321", count: 342 },
            { text: "strukturelle reformer er meget vigtige", username: "mehmetkrg", count: 342 },
            { text: "takket være Surtale-platformen kan jeg se andres meninger", username: "arman311", count: 342 },
            { text: "dark mode er fantastisk, jeg kan dele ting i hemmelighed uden at min kæreste ser det", username: "tha1221", count: 342 }
        ];

        takipItems.forEach(item => {
            const div = document.createElement('div');
            div.className = 'trending-item';
            div.innerHTML = `
                <div class="trending-content">
                    <div class="trending-text">${item.text}</div>
                    <div class="trending-username">${item.username}</div>
                </div>
                <div class="trending-count">${item.count}</div>
            `;
            container.appendChild(div);
        });
    }

    renderHashtagItems() {
        // Başlığı değiştir
        const sectionHeader = document.querySelector('.section-header h2');
        if (sectionHeader) {
            sectionHeader.textContent = '#hastags';
        }

        const container = document.getElementById('trendingList');
        container.innerHTML = '';

        const hashtagItems = [
            { text: "#københavn", count: 342 },
            { text: "#danmark", count: 156 },
            { text: "#vejr", count: 89 },
            { text: "#mad", count: 234 },
            { text: "#fodbold", count: 178 },
            { text: "#universitet", count: 67 },
            { text: "#sommer", count: 145 },
            { text: "#kærlighed", count: 98 }
        ];

        hashtagItems.forEach(item => {
            const div = document.createElement('div');
            div.className = 'trending-item';
            div.innerHTML = `
                <div class="trending-text">${item.text}</div>
                <div class="trending-count">${item.count}</div>
            `;
            container.appendChild(div);
        });
    }

    handleFilterChange(filterValue) {
        console.log(`Filter changed to: ${filterValue} for tab: ${this.currentTab}`);
        
        // Filtreleme mantığı burada uygulanabilir
        switch(this.currentTab) {
            case 'aktuel':
                this.filterGundemItems(filterValue);
                break;
            case 'folger':
                this.filterTakipItems(filterValue);
                break;
            case 'hashtags':
                this.filterHashtagItems(filterValue);
                break;
        }
    }

    filterGundemItems(filter) {
        // Gündem filtreleme mantığı
        this.showNotification(`Gündem filtrelendi: ${filter}`);
    }

    filterTakipItems(filter) {
        // Takip filtreleme mantığı
        this.showNotification(`Takip filtrelendi: ${filter}`);
    }

    filterHashtagItems(filter) {
        // Hashtag filtreleme mantığı
        this.showNotification(`Hashtag filtrelendi: ${filter}`);
    }

    showDetailPage(text, username, count) {
        // Detay sayfası HTML'i oluştur
        const detailHTML = `
            <div class="detail-overlay" id="detailOverlay">
                <div class="detail-container">
                    <div class="detail-header">
                        <button class="back-btn" id="backBtn">←</button>
                        <h2 class="detail-title">${text.substring(0, 50)}${text.length > 50 ? '...' : ''}</h2>
                        <div class="detail-nav">
                            <button class="nav-btn">først</button>
                            <button class="nav-btn">←</button>
                            <span class="page-info">1/10</span>
                            <button class="nav-btn">→</button>
                            <button class="nav-btn">sidst</button>
                        </div>
                    </div>
                    
                    <div class="detail-content">
                        <div class="post-item">
                            <div class="post-text">${text}</div>
                            <div class="post-actions">
                                <div class="vote-section">
                                    <button class="vote-btn">↑</button>
                                    <span class="vote-count">${count}</span>
                                    <button class="vote-btn">↓</button>
                                    <span class="reaction"><img src="surtale-icon.png" alt="Surtale" style="width: 24px; height: 24px;"></span>
                                </div>
                                <div class="action-buttons">
                                    <button class="action-btn"><img src="share-icon.png" alt="Share" style="width: 40px; height: 40px;"></button>
                                    <button class="action-btn">⋯</button>
                                </div>
                            </div>
                                                            <div class="post-user">
                                    <div class="user-info">
                                        <span class="user-name">${username}</span>
                                        <span class="post-date">24.08.2015 09:43</span>
                                    </div>
                                    <div class="user-avatar profile-avatar coral">
                                        <i class="fas fa-user"></i>
                                    </div>
                                </div>
                        </div>
                        
                        <div class="comment-item">
                            <div class="post-text">Jeg kender den følelse alt for godt. For mig er det som en vane, der er blevet en del af min hverdag. Når jeg vågner, er det første jeg gør at tjekke Instagram eller TikTok, selvom jeg egentlig ikke har lyst. Det er næsten som en refleks. Jeg har prøvet at slette apps flere gange, men jeg ender altid med at hente dem igen, fordi jeg føler, jeg går glip af noget vigtigt, hvis jeg ikke er online. Samtidig bliver jeg stresset af at se, hvordan alle andre tilsyneladende lever perfekte liv. Det er en ond cirkel, og jeg tror, mange af os kæmper med det samme problem.</div>
                            <div class="post-actions">
                                <div class="vote-section">
                                    <button class="vote-btn">↑</button>
                                    <span class="vote-count">3</span>
                                    <button class="vote-btn">↓</button>
                                    <span class="reaction"><img src="surtale-icon.png" alt="Surtale" style="width: 24px; height: 24px;"></span>
                                </div>
                                <div class="action-buttons">
                                    <button class="action-btn"><img src="share-icon.png" alt="Share" style="width: 40px; height: 40px;"></button>
                                    <button class="action-btn">⋯</button>
                                </div>
                            </div>
                                                            <div class="post-user">
                                    <div class="user-info">
                                        <span class="user-name">klleaiy</span>
                                        <span class="post-date">24.08.2005 09:30</span>
                                    </div>
                                    <div class="user-avatar profile-avatar yellow">
                                        <i class="fas fa-user"></i>
                                    </div>
                                </div>
                        </div>
                        
                        <div class="comment-item">
                            <div class="post-text">At tage en pause fra sociale medier kan være en kæmpe lettelse - pludselig får man ro i hovedet</div>
                            <div class="post-actions">
                                <div class="vote-section">
                                    <button class="vote-btn">↑</button>
                                    <span class="vote-count">31</span>
                                    <button class="vote-btn">↓</button>
                                    <span class="reaction"><img src="surtale-icon.png" alt="Surtale" style="width: 24px; height: 24px;"></span>
                                </div>
                                <div class="action-buttons">
                                    <button class="action-btn"><img src="share-icon.png" alt="Share" style="width: 40px; height: 40px;"></button>
                                    <button class="action-btn">⋯</button>
                                </div>
                            </div>
                                                            <div class="post-user">
                                    <div class="user-info">
                                        <span class="user-name">ellisah</span>
                                        <span class="post-date">24.08.2025 09:43</span>
                                    </div>
                                    <div class="user-avatar profile-avatar purple">
                                        <i class="fas fa-user"></i>
                                    </div>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Detay sayfasını ekle
        document.body.insertAdjacentHTML('beforeend', detailHTML);
        document.body.style.overflow = 'hidden';
        
        // Geri butonuna event listener ekle
        document.getElementById('backBtn').addEventListener('click', () => {
            this.hideDetailPage();
        });
        
        // Overlay'e tıklayınca kapat
        document.getElementById('detailOverlay').addEventListener('click', (e) => {
            if (e.target.id === 'detailOverlay') {
                this.hideDetailPage();
            }
        });
    }

    hideDetailPage() {
        const overlay = document.getElementById('detailOverlay');
        if (overlay) {
            overlay.remove();
            document.body.style.overflow = 'auto';
        }
    }

    showNotification(message) {
        // Basit bildirim sistemi
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #81c04b;
            color: white;
            padding: 12px 24px;
            border-radius: 20px;
            z-index: 3000;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    loadSampleData() {
        this.trendingItems = [
            { text: "den industrielle evolution og dens", count: 342 },
            { text: "har danmark en gang været tæt på at", count: 46 },
            { text: "mine tanker om sund aldring og", count: 46 },
            { text: "Forelsket i min bedste vens kæreste", count: 342 },
            { text: "Bruger alt for mange penge på kaffe", count: 46 },
            { text: "Har en hemmelig konto kun til memes", count: 46 },
            { text: "Bedste serier at binge lige nu?", count: 213 },
            { text: "Der findes ingen dårligere følelse end mandag", count: 12 },
            { text: "Sommer i Danmark varer altid for kort", count: 46 },
            { text: "Spotify-wrapped afslører altid for meget", count: 46 },
            { text: "Ingen forstår mig, når jeg siger at jeg elsker", count: 46 },
            { text: "McDonald's efter en bytur er obligatorisk", count: 89 },
            { text: "Kaffe er mit brændstof", count: 156 }
        ];
    }

    handleSearch(query) {
        if (!query.trim()) {
            document.getElementById('searchResults').style.display = 'none';
            return;
        }

        let mockResults = [];

        // Messi için özel sonuçlar
        if (query.toLowerCase() === 'messi') {
            mockResults = [
                { title: 'messi', author: 'Anon#123' },
                { title: 'messi (serie)', author: 'Anon#456' },
                { title: 'tulle på messi', author: 'Anon#789' },
                { title: 'messi vs ronaldo vs ronaldinho vs pele vs maradona', author: 'Anon#321' },
                { title: 'lionel messi', author: 'Anon#654' },
                { title: 'cristiano ronaldo vs lionel messi', author: 'Anon#987' },
                { title: 'diego armando maradona vs lionel messi', author: 'Anon#555' },
                { title: 'hvad sagde de om lionel messi', author: 'Anon#777' },
                { title: 'messi neymar mbappe trio', author: 'Anon#888' },
                { title: '@messi', author: 'Anon#999' },
                { title: '@messi er ikke en god spiller', author: 'Anon#111' },
                { title: '@messi er en ballon', author: 'Anon#222' }
            ];
        } else {
            // Diğer aramalar için genel sonuçlar
            mockResults = [
                { title: `de bedste entries om ${query}`, author: 'Anon#123' },
                { title: `mine tanker om ${query}`, author: 'Anon#456' },
                { title: `mine erfaringer med ${query}`, author: 'Anon#789' },
                { title: `spørgsmål om ${query}`, author: 'Anon#321' },
                { title: `anbefalinger til ${query}`, author: 'Anon#654' }
            ];
        }

        this.displaySearchResults(mockResults);
    }

    displaySearchResults(results) {
        const resultsContainer = document.getElementById('searchResults');
        resultsContainer.innerHTML = '';

        results.forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            resultItem.innerHTML = `
                <div class="search-result-title">${result.title}</div>
                <div class="search-result-author">${result.author}</div>
            `;
            resultsContainer.appendChild(resultItem);
        });

        resultsContainer.style.display = 'block';
    }

    switchProfileTab(tabName) {
        console.log('Switching profile tab to:', tabName);
        
        const content = document.querySelector('.profile-content');
        
        switch(tabName) {
            case 'entries':
                content.innerHTML = `
                    <div class="profile-entry">
                        <div class="entry-text">at eje flere huse skal forbydes</div>
                        <div class="entry-comment">præcis</div>
                        <div class="entry-actions">
                            <div class="entry-reactions">
                                <i class="fas fa-heart"></i>
                                <i class="fas fa-tint"></i>
                            </div>
                            <div class="entry-share">
                                <i class="fas fa-share-square"></i>
                                <i class="fas fa-ellipsis-h"></i>
                            </div>
                        </div>
                        <div class="entry-author">
                            <span class="author-name">arm31</span>
                            <span class="entry-date">05.09.2025 21:33</span>
                            <div class="author-avatar">
                                <i class="fas fa-user"></i>
                            </div>
                        </div>
                    </div>
                `;
                break;
            case 'favorites':
                content.innerHTML = `
                    <div class="profile-entry">
                        <div class="entry-text">Du har ingen favorit entries endnu.</div>
                    </div>
                `;
                break;
            case 'stats':
                content.innerHTML = `
                    <div class="profile-entry">
                        <div class="entry-text">Statistikker</div>
                        <div class="entry-comment">Total entries: 0</div>
                        <div class="entry-comment">Total likes: 0</div>
                        <div class="entry-comment">Antal følgere: 0</div>
                    </div>
                `;
                break;
        }
    }
}

// Uygulamayı başlat
const app = new SurtaleApp();

// Global fonksiyonlar
window.app = app;