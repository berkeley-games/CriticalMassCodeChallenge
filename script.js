class Navigator
{
    data;
    time;
    navLine;
    navContainer;
    buttons = [];
    activeButton;

    constructor(json)
    {
        this.data = json;
        this.navLine = document.getElementById("navigationLine");
        this.navContainer = document.getElementById("navContainer")
        this.time = document.getElementById("time");

        let isSafari = navigator.userAgent.indexOf("Windows") === -1;
        if(isSafari) this.navLine.style.bottom = "-1px";

        // loop through the cities array and create a button element for each
        this.data["cities"].forEach(object => {
            this.createNavigationComponent(object);
        });
 
        // move the selection line when the window resizes
        window.addEventListener('resize', (event) => 
        {
            if(this.activeButton) 
            {
                this.moveLine(false);
                this.moveTime(false);
            }
        });
    }

    createNavigationComponent(object)
    {
        let buttonContainer = document.createElement("div");
        buttonContainer.className = "buttonContainer";
        this.navContainer.appendChild(buttonContainer);

        let button = document.createElement("button");
        button.type = "button";
        button.className = "navigationButton";
        button.innerHTML = object.label;
        buttonContainer.appendChild(button);
        this.buttons.push(button);

        button.data = object;

        button.onclick = (event) => {
            this.onSelection(event.target);
        };
    }

    // when a button is clicked, move the line to the button
    onSelection(selectedButton)
    {
        // flag used to determine whether we should animate the time & underline
        let firstSelection = typeof this.activeButton === "undefined";

        this.activeButton = selectedButton;

        this.buttons.forEach(button => 
        {
            button.classList.remove("navSelected");
            button.disabled = false;
        });

        this.activeButton.disabled = true;
        this.activeButton.classList.add("navSelected");

        this.moveLine(!firstSelection);
        this.moveTime(!firstSelection);
        this.getTime(this.activeButton.data.timezone);
    }

    moveLine(animate = true)
    {
        if(!animate) this.navLine.style.transition = "none";
        else this.navLine.style.transition = "350ms";

        this.navLine.style.width = this.activeButton.offsetWidth + "px";
        this.navLine.style.marginLeft = this.activeButton.offsetLeft + "px";
    }

    moveTime(animate = true)
    {
        if(!animate) this.time.style.transition = "none";
        else this.time.style.transition = "350ms";

        this.time.style.width = this.activeButton.offsetWidth + "px";
        this.time.style.marginLeft = this.activeButton.offsetLeft + "px";
    }

    getTime(timezone)
    {
        fetch("https://worldtimeapi.org/api/timezone/" + timezone)
            .then(response => response.json())
            .then(this.showTime.bind(this));
    }

    showTime(date)
    {
        let timeString = date.datetime.substring(11, 19);
        this.time.innerHTML = timeString;
    }
}

// would normally fetch a json file, but we can run this locally
// added the appropriate timezone to each object for simplicity sake
let json = 
{
    "cities": 
    [
        {
            "section": "cupertino",
            "label": "Cupertino",
            "timezone": "America/Los_Angeles"
        },
        {
            "section": "new-york-city",
            "label": "New York City",
            "timezone": "America/New_York"
        },
        {
            "section": "london",
            "label": "London",
            "timezone": "Europe/London"
        },
        {
            "section": "amsterdam",
            "label": "Amsterdam",
            "timezone": "Europe/Amsterdam"
        },
        {
            "section": "tokyo",
            "label": "Tokyo",
            "timezone": "Asia/Tokyo"
        },
        {
            "section": "hong-kong",
            "label": "Hong Kong",
            "timezone": "Asia/Hong_Kong"
        },
        {
            "section": "sydney",
            "label": "Sydney",
            "timezone": "Australia/Sydney"
        }
    ]
};  

window.addEventListener('load', (event) => {
    let navigation = new Navigator(json);
});