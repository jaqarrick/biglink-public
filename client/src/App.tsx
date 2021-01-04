import * as React from "react"
import styled from "@emotion/styled"
import isValidUrl from "./helpers/isValidUrl"
import { Link, Copy, Submit } from "./svgs/index"
interface InputProps {
	isValid: boolean
}

const WrapperElement = styled.div`
	width: 100vw;
	height: 100vh;
	overflow: hidden;
	display: flex;
	justify-content: center;
	background-color: #fffef5;
`

const ContentContainerElement = styled.div`
	width: 30%;
	height: 100%;
	/* border: solid black 1px; */
`

const HeaderElement = styled.header`
	height: 10rem;
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin-top: 1.3rem;
`

const HeaderTitleContainerElement = styled.div`
	width: 80%;
	height: 70%;
	display: flex;
	justify-content: space-between;
	font-family: "new_wavemedium";
	font-size: 5rem;
	border-bottom: dotted 0.6rem black;
`
const MainSectionElement = styled.div`
	font-family: "Montserrat", sans-serif;
	margin-top: 1rem;
`

const URLInputContainerElement = styled.div`
	position: relative;
`

const URLInput = styled.input<InputProps>`
	width: 98%;
	height: 3.4rem;
	border: solid ${({ isValid }) => (isValid ? "black" : "black")} 0.1rem;
	padding: 0;
	color: rgba(0, 0, 0, 0.21);
	font-family: inherit;
	padding: 0 0 0 0.3rem;
	outline: none;
`

const SubmitButton = styled.button<InputProps>`
	position: absolute;
	background-color: transparent;
	right: 0;
	top: 0;
	bottom: 0;
	border: none;
	padding: none;
	cursor: pointer;
	height: 100%;
	display: flex;
	justify-content: center;
	flex-direction: column;
	outline: none;
	transition: opacity 0.4s;
	opacity: ${({ isValid }) => (isValid ? 1 : 0)};
`

const TextDisplayContainerElement = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
	margin-top: 2rem;
	margin-bottom: 2rem;
	color: #371fcd;
`

const ShortURLContainerElement = styled.div`
	width: 100%;
	position: relative;
`

const ShortUrlInput = styled.input`
	width: 98%;
	height: 3.4rem;
	border: solid black 1px;
	font-family: inherit;
	padding: 0 0 0 0.3rem;
	outline: none;
`
const CopyButton = styled.button`
	position: absolute;
	right: 0;
	padding: none;
	border: none;
	background-color: transparent;
	cursor: pointer;
	bottom: 0;
	top: 0;
	outline: none;
`

export default () => {
	const [displayText, setDisplayText] = React.useState<string>(
		"Paste a URL you want to shorten."
	)
	const [urlString, setUrlString] = React.useState<string>("")
	const [isValid, setIsValid] = React.useState<boolean>(false)
	React.useEffect(() => console.log(urlString), [urlString])

	const checkUrlString = React.useCallback(
		(string: string) => {
			setIsValid(isValidUrl(string))
			if (isValidUrl(string)) {
				setUrlString(string)
			}
		},
		[setIsValid, setUrlString]
	)

	const [shortUrl, setShortUrl] = React.useState<string>()

	const copyShortUrlToClipboard = React.useCallback(async () => {
		if (navigator.clipboard) {
			if (shortUrl) await navigator.clipboard.writeText(shortUrl)
			setDisplayText("The URL has been copied to your clipboard.")
		}
	}, [shortUrl])
	const sendShortenRequest = React.useCallback(
		e => {
			const urlToShorten = urlString
			fetch("/api/url/shorten/", {
				method: "POST",
				body: JSON.stringify({
					longUrl: urlString,
				}),
				headers: {
					"Content-Type": "application/json",
				},
			})
				.then(res => res.json())
				.then(res => {
					console.log(res.shortUrl)
					if (res.shortUrl) {
						setShortUrl(res.shortUrl)
						setDisplayText("Success! Here's your shortened URL...")
					}
				})
		},
		[urlString, setShortUrl]
	)

	return (
		<>
			<WrapperElement>
				<ContentContainerElement>
					<HeaderElement>
						<HeaderTitleContainerElement>
							<span>BIG</span>
							<span>
								{" "}
								<Link />{" "}
							</span>
							<span>LINK</span>
						</HeaderTitleContainerElement>
					</HeaderElement>
					<MainSectionElement>
						<URLInputContainerElement>
							<URLInput
								isValid={isValid}
								type='text'
								placeholder='https://example.com'
								onChange={e => checkUrlString(e.target.value)}></URLInput>
							<SubmitButton isValid={isValid} onClick={sendShortenRequest}>
								<Submit />
							</SubmitButton>
						</URLInputContainerElement>
						<TextDisplayContainerElement>
							{displayText}
						</TextDisplayContainerElement>
						{shortUrl ? (
							<ShortURLContainerElement>
								<ShortUrlInput type='text' value={shortUrl}></ShortUrlInput>
								<CopyButton onClick={copyShortUrlToClipboard}>
									<Copy />
								</CopyButton>
							</ShortURLContainerElement>
						) : null}
					</MainSectionElement>
				</ContentContainerElement>
			</WrapperElement>
		</>
	)
}
