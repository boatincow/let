<script>
    let info = `→ ↓ space — next <br/>
                ← ↑ — prev <br/>
                enter — fullscreen <br/>
                s - stop motion <br/>
                you can drag and drop 360º photos here <br/>
                scroll to zoom`;
    let divInside = "i";
</script>

<style>

    div {
        font-family: PT Sans;
        color: black;
        background-color: white;
        border-radius: 50%;

        position: absolute;
        transform:translate(-100%, -100%);
        top: calc(100% - 10px);
        left: calc(100% - 10px);

        width: 30px;
        height: 30px;

        text-align: center;
        line-height: 30px;

        opacity: 0.2;
    }

    div:hover {
        padding: 0px 10px;
        width: 340px;
        height: initial;
        border-radius: 3px;
        opacity: 1;

    }

    @media only screen and (max-width: 600px) {
        div {
            display: none;
        }
    }

</style>

<div on:mouseover={e=>divInside = info} on:mouseout={e=>divInside = "i"}>{@html divInside}</div>