rc:
	yarn run build
	npm version prerelease --preid=rc ----no-git-tag-version
	npm publish