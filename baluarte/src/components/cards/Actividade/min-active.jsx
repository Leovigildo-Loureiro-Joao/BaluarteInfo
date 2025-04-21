export const MinActive = ({titulo,descricao}) => {
    return (
        <article className="flex flex-col">
            <div>
                <div>
                    <h2>{titulo}</h2>
                    <p>
                        {descricao}
                    </p>
                    <button>Saber mais</button>
                </div>
            </div>
        </article>
    );
}