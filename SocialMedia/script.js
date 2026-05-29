document.addEventListener('DOMContentLoaded', () => {
    const feed = document.getElementById('tweet-feed');
    const tabs = document.querySelectorAll('.profile-tabs .tab');
    const searchInput = document.getElementById('TweetSearch');
    const ExpandBox = document.getElementById('image-ExpandBox');
    const ExpandBoxImg = document.getElementById('ExpandBox-img');
    const ExpandBoxClose = document.querySelector('.ExpandBox-close');

    let allTweets = [];
    let filteredTweets = [];
    let currentIndex = 0;
    const tweetsPerPage = 10;
    let currentTab = 'tweets';
    let observer;

    // Fetch the data
    fetch('knights_cygames_tweet_archive.json')
        .then(response => response.json())
        .then(data => {
            allTweets = data;
            applyFilters();
            createInfiniteScrollObserver();
        })
        .catch(err => console.error('Error loading tweets:', err));

    // Handle Tab Clicking
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            tabs.forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');

            currentTab = e.target.getAttribute('data-tab');
            resetFeed();
        });
    });

    // Handle Search Input (Fires as the user types)
    searchInput.addEventListener('input', () => {
        resetFeed();
    });

    // Reset pagination context when filters, tabs, or search text change
    function resetFeed() {
        feed.innerHTML = '';
        currentIndex = 0;
        applyFilters();
    }

    // Filter tweets array based on active tab state AND search keywords
    function applyFilters() {
        const searchQuery = searchInput.value.toLowerCase().trim();

        filteredTweets = allTweets.filter(tweet => {
            if (currentTab === 'media') {
                const hasMedia = tweet.downloaded_images && tweet.downloaded_images.length > 0;
                if (!hasMedia) return false;
            }

            // matches against text content, account handle, or date
            if (searchQuery !== '') {
                const textMatches = tweet.text_content && tweet.text_content.toLowerCase().includes(searchQuery);
                const handleMatches = tweet.account && tweet.account.toLowerCase().includes(searchQuery);
                
                // Convert the ISO timestamp into the exact same human-readable format shown on the card
                const formattedDate = new Date(tweet.date_posted).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric'
                }).toLowerCase();
                
                const dateMatches = formattedDate.includes(searchQuery);
                
                return textMatches || handleMatches || dateMatches; // Return true if any match
            }

            return true;
        });
        
        if (filteredTweets.length === 0) {
            feed.innerHTML = `<div class="no-results">No matching tweets found.</div>`;
            return;
        }

        loadNextBatch(); // Load initial 10 elements of the fresh filter
    }

    // Function to slice data and append next 10 tweets
    function loadNextBatch() {
        if (currentIndex >= filteredTweets.length) return;

        const nextBatch = filteredTweets.slice(currentIndex, currentIndex + tweetsPerPage);
        currentIndex += tweetsPerPage;

        const htmlContent = nextBatch.map(tweet => {
            const date = new Date(tweet.date_posted).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
            });

            const mediaHtml = tweet.downloaded_images && tweet.downloaded_images.length > 0 
                ? `<div class="tweet-media">
                    ${tweet.downloaded_images.map(img => `<img src="${img}" alt="Tweet Media" loading="lazy">`).join('')}
                   </div>`
                : '';

            return `
                <article class="tweet-card">
                    <div class="tweet-avatar"></div>
                    <div class="tweet-content">
                        <div class="tweet-header">
                            <span class="tweet-user">ナイツオブグローリー公式</span>
                            <span class="tweet-handle">${tweet.account}</span>
                            <span class="tweet-dot">·</span>
                            <span class="tweet-date">${date}</span>
                        </div>
                        <div class="tweet-text">${tweet.text_content}</div>
                        ${mediaHtml}
                        <div class="tweet-actions">
                            <i class="bi bi-chat"></i>
                            <i class="bi bi-arrow-repeat"></i>
                            <i class="bi bi-heart"></i>
                            <i class="bi bi-share"></i>
                        </div>
                    </div>
                </article>
            `;
        }).join('');

        feed.insertAdjacentHTML('beforeend', htmlContent);
    }

    // --- ExpandBox LOGIC ---
    feed.addEventListener('click', (e) => {
        if (e.target.tagName === 'IMG' && e.target.closest('.tweet-media')) {
            ExpandBox.style.display = 'flex';
            ExpandBoxImg.src = e.target.src;
            document.body.style.overflow = 'hidden'; 
        }
    });

    ExpandBoxClose.addEventListener('click', closeExpandBox);
    ExpandBox.addEventListener('click', (e) => {
        if (e.target === ExpandBox || e.target === ExpandBoxImg) {
            closeExpandBox();
        }
    });
    function closeExpandBox() {
        ExpandBox.style.display = 'none';
        document.body.style.overflow = '';
    }

    // Detect when user reaches the bottom
    function createInfiniteScrollObserver() {
        const scrollSentinel = document.createElement('div');
        scrollSentinel.id = 'scroll-sentinel';
        scrollSentinel.style.height = '10px';
        feed.after(scrollSentinel);

        observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && currentIndex < filteredTweets.length) {
                loadNextBatch();
            }
        }, {
            rootMargin: '300px'
        });

        observer.observe(scrollSentinel);
    }
});