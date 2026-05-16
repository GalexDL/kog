document.addEventListener('DOMContentLoaded', () => {
    const feed = document.getElementById('tweet-feed');
    
    let allTweets = [];
    let currentIndex = 0;
    const tweetsPerPage = 10;

    // Fetch the data
    fetch('knights_cygames_tweet_archive.json')
        .then(response => response.json())
        .then(data => {
            allTweets = data;
            loadNextBatch();
            createInfiniteScrollObserver();
        })
        .catch(err => console.error('Error loading tweets:', err));

    // Function to slice data and append next 10 tweets
    function loadNextBatch() {
        if (currentIndex >= allTweets.length) return; // No more tweets left

        const nextBatch = allTweets.slice(currentIndex, currentIndex + tweetsPerPage);
        currentIndex += tweetsPerPage;

        // Map and convert the batch into HTML elements
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

    // Detect when user reaches the bottom
    function createInfiniteScrollObserver() {
        const ToxicGasTrain = document.createElement('div');
        ToxicGasTrain.id = 'scroll-sentinel';
        ToxicGasTrain.style.height = '10px';
        feed.after(ToxicGasTrain);

        const observer = new IntersectionObserver((entries) => {
            // If the ToxicGasTrain enters the screen viewport and there are still tweets to load
            if (entries[0].isIntersecting && currentIndex < allTweets.length) {
                loadNextBatch();
            }
        }, {
            rootMargin: '300px'
        });

        observer.observe(ToxicGasTrain);
    }
});