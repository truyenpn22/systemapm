# APM system

This is an HTML and JavaScript code to display the apm system using D3.js.

## How to Use

1. **Clone Repository:** Clone the repository to your computer.
2. **Project Structure:**
   - `index.html`: Main HTML file to display the graph.
   - `system.js`: Apm system JavaScript file
   - `data.json`: File containing data.
3. **Run:** Open the `index.html` file in a web browser.

## Requirements

- Web browser that supports D3.js .
- Data for the graph is stored in `data.json`.

## Data
This JSON data describes the services and their actions, including information about the timing and status of each action.
### Structure
The dataset is structured as follows:

* `id`: “page1” Identifier of the service page.
* `name`: ”service1” Name of the service.
* `listService`:[...] List of services and the number of users participating in a page.
    * `id`: “user1” Identifier of the service.
    * `name`: ”service1” Name of the service.
    * `actions`:[...] Actions that can be performed for the service.
    * `timeIn`: Action start time (ms) from `register` action to `WEB`.
    * `timeOut`: Action end time (ms) from `WEB` action to `unregister`.
    * `status`: The status of the action will include 3 states: `normal`, `warning`, `danger`. The status will change
over time of the data.

## Code Explanation

```
<script type="module">
    d3.json("data.json").then(function (data) {
        const networkchart = new SystemApm({
            ID (required): "system",
            data (optional): data,
            timeWarning (optional): 8000,
            timeDanger (optional): 12000,
        })
    })
</script>
```

* `classId`: "system": Specifies the ID of the HTML element where the system displays.
* `data`: Passes loaded data that will be used to create the apm system graph.
* `timeWarning`: Time for services to be warned when greater than 8 seconds.
* `timeDanger`: The time the services are in danger when greater than 12 seconds.

## Libraries and Technologies

- D3.js: Used to get color codes.

