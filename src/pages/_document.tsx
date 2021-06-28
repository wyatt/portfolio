import Document, {NextScript, Html, Head, Main} from 'next/document';

class Doc extends Document {
	render() {
		// noinspection HtmlRequiredTitleElement
		return (
			<Html lang={'en'}>
				<Head />
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default Doc;
