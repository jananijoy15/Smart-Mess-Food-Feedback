let feedbackList = JSON.parse(
    localStorage.getItem("messFeedback")
) || [];

const feedbackForm = document.getElementById("feedbackForm");
const feedbackContainer = document.getElementById("feedbackContainer");


// Display saved feedback when page opens
displayFeedback();
updateSummary();


// Submit feedback
feedbackForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const feedback = {
        id: Date.now(),
        name: document.getElementById("studentName").value,
        meal: document.getElementById("meal").value,
        rating: document.getElementById("rating").value,
        comment: document.getElementById("comment").value
    };

    // Add feedback
    feedbackList.push(feedback);

    // Save to Local Storage
    localStorage.setItem(
        "messFeedback",
        JSON.stringify(feedbackList)
    );

    // Update display
    displayFeedback();
    updateSummary();

    // Clear form
    feedbackForm.reset();

    // Success message
    alert("Thank you for your feedback! ⭐");

    // Scroll to recent feedback
    document.getElementById("feedbackContainer").scrollIntoView({
        behavior: "smooth"
    });
});


// Display feedback
function displayFeedback() {

    feedbackContainer.innerHTML = "";

    if (feedbackList.length === 0) {

        feedbackContainer.innerHTML =
            "<p>No feedback submitted yet.</p>";

        return;
    }

    feedbackList.forEach(function(feedback) {

        const card = document.createElement("div");

        card.className = "feedback-card";

        card.innerHTML = `
            <h3>${feedback.name}</h3>

            <p>
                🍽️ <strong>Meal:</strong>
                ${feedback.meal}
            </p>

            <p class="rating">
                ⭐ ${feedback.rating}/5
            </p>

            <p>
                💬 ${feedback.comment}
            </p>

            <button
                class="delete-feedback"
                onclick="deleteFeedback(${feedback.id})">
                Delete
            </button>
        `;

        feedbackContainer.appendChild(card);
    });
}


// Delete feedback
function deleteFeedback(id) {

    feedbackList = feedbackList.filter(function(feedback) {
        return feedback.id !== id;
    });

    localStorage.setItem(
        "messFeedback",
        JSON.stringify(feedbackList)
    );

    displayFeedback();
    updateSummary();
}


// Update rating summary
function updateSummary() {

    const totalFeedback =
        document.getElementById("totalFeedback");

    const averageRating =
        document.getElementById("averageRating");

    const topMeal =
        document.getElementById("topMeal");


    // No feedback
    if (feedbackList.length === 0) {

        totalFeedback.textContent = "0";
        averageRating.textContent = "0.0 ⭐";
        topMeal.textContent = "-";

        return;
    }


    // Total feedback
    totalFeedback.textContent =
        feedbackList.length;


    // Calculate average rating
    let totalRating = 0;

    feedbackList.forEach(function(feedback) {

        totalRating += Number(feedback.rating);

    });

    const average =
        totalRating / feedbackList.length;

    averageRating.textContent =
        average.toFixed(1) + " ⭐";


    // Calculate top rated meal
    const mealRatings = {};


    feedbackList.forEach(function(feedback) {

        if (!mealRatings[feedback.meal]) {

            mealRatings[feedback.meal] = {
                total: 0,
                count: 0
            };

        }

        mealRatings[feedback.meal].total +=
            Number(feedback.rating);

        mealRatings[feedback.meal].count++;

    });


    let bestMeal = "-";
    let bestAverage = 0;


    for (let meal in mealRatings) {

        const mealAverage =
            mealRatings[meal].total /
            mealRatings[meal].count;


        if (mealAverage > bestAverage) {

            bestAverage = mealAverage;
            bestMeal = meal;

        }

    }


    topMeal.textContent = bestMeal;
}