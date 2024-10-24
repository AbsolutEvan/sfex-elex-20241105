console.log('script.js is running');

document.addEventListener('DOMContentLoaded', () => {
    // Fetch and parse the XML data
    fetch('data/summary.xml')
        .then(response => {
            console.log('Fetch Response:', response); // Log the fetch response
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.text();
        })
        .then(xmlString => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlString, "text/xml");
            console.log('Parsed XML Document:', xmlDoc); // Log the parsed XML document
            updateDashboard(xmlDoc);
        })
        .catch(error => console.error('Error fetching or parsing XML data:', error));
});

function updateDashboard(xmlDoc) {
    console.log('updateDashboard function is running'); // Confirm that the function is called

    try {
        // Update the election summary section
        const registrationNode = xmlDoc.querySelector("electorGroupId2");
        const totalBallots = registrationNode?.getAttribute("ballots2") || 0;
        console.log('Total Ballots:', totalBallots); // Debugging
        document.getElementById('total-ballots').textContent = totalBallots;

        const precinctsNode = xmlDoc.querySelector("Details");
        const precinctsReported = precinctsNode?.getAttribute("reported") || "0 of 514";
        console.log('Precincts Reported:', precinctsReported); // Debugging
        document.getElementById('precincts-reported').textContent = precinctsReported;

        // Populate the contests overview
        const contestsList = document.getElementById('contests-list');
        contestsList.innerHTML = ''; // Clear previous entries

        const contests = xmlDoc.querySelectorAll("ContestIdGroup");
        console.log('Number of Contests:', contests.length); // Debugging
        contests.forEach(contest => {
            const contestName = contest.getAttribute("contestId");
            console.log('Contest Name:', contestName); // Debugging

            const contestElement = document.createElement("div");
            contestElement.className = "contest-item";
            contestElement.innerHTML = `<h3>${contestName}</h3><ul></ul>`;
            const candidatesList = contestElement.querySelector("ul");

            const candidates = contest.querySelectorAll("chGroup");
            candidates.forEach(candidate => {
                const candidateName = candidate.querySelector("candidateNameTextBox4")?.getAttribute("candidateNameTextBox4");
                console.log('Candidate Name:', candidateName); // Debugging
                let electionDayVotes = 0;
                let voteByMailVotes = 0;

                const voteGroups = candidate.querySelectorAll("cgGroup");
                voteGroups.forEach(voteGroup => {
                    electionDayVotes += parseInt(voteGroup.getAttribute("vot7")) || 0;
                    voteByMailVotes += parseInt(voteGroup.getAttribute("vot4")) || 0;
                });

                const totalVotes = electionDayVotes + voteByMailVotes;
                const candidateElement = document.createElement("li");
                candidateElement.textContent = `${candidateName}: ${totalVotes} votes (Election Day: ${electionDayVotes}, Vote by Mail: ${voteByMailVotes})`;
                candidatesList.appendChild(candidateElement);
            });

            contestsList.appendChild(contestElement);
        });
    } catch (error) {
        console.error('Error updating dashboard:', error); // Debugging
    }
}
