export default interface ViewerImage {
	url: string;
	height?: number;
	width?: number;
	props?: {
		resizeMode: string;
	};
}
