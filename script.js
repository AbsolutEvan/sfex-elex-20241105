document.addEventListener('DOMContentLoaded', () => {
    // Fetch and parse the XML data
    fetch('data/summary.xml')
        .then(response => response.text())
        .then(xmlString => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlString, "text/xml");
            updateDashboard(xmlDoc);
        })
        .catch(error => console.error('Error fetching XML data:', error));

    function updateDashboard(xmlDoc) {
        // Update the election summary section
        const totalBallots = xmlDoc.querySelector("electorGroupId2")?.getAttribute("ballots2") || 0;
        document.getElementById('total-ballots').textContent = totalBallots;

        const precinctsReported = xmlDoc.querySelector("Details")?.getAttribute("reported") || "0 of 514";
        document.getElementById('precincts-reported').textContent = precinctsReported;

        // Populate the contests overview
        const contestsList = document.getElementById('contests-list');
        contestsList.innerHTML = ''; // Clear previous entries

        const contests = xmlDoc.querySelectorAll("ContestIdGroup");
        contests.forEach(contest => {
            const contestName = contest.getAttribute("contestId");
            const contestElement = document.createElement("div");
            contestElement.className = "contest-item";
            contestElement.innerHTML = `<h3>${contestName}</h3><ul></ul>`;
            const candidatesList = contestElement.querySelector("ul");

            const candidates = contest.querySelectorAll("chGroup");
            candidates.forEach(candidate => {
                const candidateName = candidate.getAttribute("candidateNameTextBox4");
                let electionDayVotes = 0;
                let voteByMailVotes = 0;

                // Sum up votes from different voting methods (e.g., Election Day and Vote by Mail)
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
    }
});
