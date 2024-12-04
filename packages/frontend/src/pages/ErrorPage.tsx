const ErrorPage: React.FC<{ error: Error }> = ({ error }) => {
    return (
        <div className="w-full h-full flex flex-col justify-center items-center">
            <h1 className="font-bold text-4xl mb-4">
                Woops! <br />Something went wrong :(
            </h1>
            <h2 className="text-base">
                Try refreshing the page.
            </h2>
            <details>
                <summary className="mb-4 text-center">Error Details</summary>
                <code className="bg-gray-800 rounded-md py-2 px-4">
                    {error.message}
                </code>
            </details>
        </div>
    );
}

export default ErrorPage;