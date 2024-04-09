
export const Error404: React.FC = () => {
    return (
        <div style={
            {
                paddingTop: '9rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2rem'
            }
        }>
            <h1>
                404 Page Not Found!
            </h1>
            <p>
                This page does not exist.
            </p>
        </div>
    )
}