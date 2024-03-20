export class LinkUtil
{
	static dowloadByBlob(blob:Blob,fileName:string)
	{
		const url = window.URL.createObjectURL(new Blob([blob]));
		const link = document.createElement('a');
		link.href = url;
		link.setAttribute('download', fileName);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
}