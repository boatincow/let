<script>
    let info = `→/↓/space — дальше<br/>
                ←/↑ — назад<br/>
                enter — полный экран<br/>
                s — остановить движение<br/>
                можно перетащить файл с панорамой<br/>
                скролл для увеличения`;
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
        width: 300px;
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