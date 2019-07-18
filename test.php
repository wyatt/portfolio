<html>


<head>
    <title>Pi HUD</title>
    <script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
</head>

<body>
    <div>
        <p>Trying to use JSON. heres the result:</p>
        <br>
        <button onclick="gamer()">Get Data</button>
        <h1 id="data"></h1>
    </div>
</body>
<script>
    const gamer = () => {
        fetch('https://www.rescuetime.com/anapi/daily_summary_feed?key=B63BGbvVSelnpQZxw0WU8rDTCuAjZYZmKrwPXhbq', {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'text/json',
                }
            })
            .then(response => response.json())
            .then(data => {
                $("#data").text = data // Prints result from `response.json()`
            })
            .catch(error => console.log("error"))
    }

</script>
