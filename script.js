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
        // Example: Update summary section
        const totalBallots = xmlDoc.querySelector("electorGroupId2[ballots2]").getAttribute("ballots2");
        document.getElementById('total-ballots').textContent = totalBallots;

        const precinctsReported = xmlDoc.querySelector("Details[reported]").getAttribute("reported");
        document.getElementById('precincts-reported').textContent = precinctsReported;

        // TODO: Add more data parsing and DOM manipulation here
    }
});
