import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ipcRenderer, clipboard } from 'electron'
import autobind from 'autobind-decorator'
import Codemirror from 'react-codemirror'
import toMarkdown from 'to-markdown'
import marked from 'marked'
import MarkdownHelper from './MarkdownHelper'

class MarkdownEditor extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = {
      value: MarkdownHelper.htmlToMarkdown(props.value)
		}
  }

  componentWillMount() {
		ipcRenderer.on("finish-add-file", this.handleFinishUploadFile)
	}

	componentWillUnmount() {
		ipcRenderer.removeListener("finish-add-file", this.handleFinishUploadFile)
	}

	componentDidMount() {
		const { editor } = this.refs
		let cm = editor.getCodeMirror()
		cm.on("paste", this.handlePaste)
	}

	shouldComponentUpdate(nextProps, nextState) {
		return false
	}

	@autobind
  handleFinishUploadFile(e, fileUrl) {
		const { editor } = this.refs
		console.log("finishUploadFile", fileUrl)
		if (fileUrl) {
			let cm = editor.getCodeMirror()
			let CodeMirror = editor.getCodeMirrorInstance()
			cm.replaceRange("![](" + fileUrl + ")\n\n", CodeMirror.Pos(cm.getCursor().line))
		}
	}

	@autobind
	handlePaste(e) {
		const { currentBlog } = this.props

		let image = clipboard.readImage()
		if (!image.isEmpty()) {
			ipcRenderer.send("add-clipboard-image", currentBlog.name)
		}
	}

  getContent() {
    const { value } = this.state
    return MarkdownHelper.markdownToHtml(value)
  }

	@autobind
  handleChangeContent(value) {
    this.setState({
      value: value
    })
  }

  render() {
    const { value } = this.state

    let options = {
			lineNumbers: false,
			lineWrapping: true,
			mode: 'markdown',
			theme:'default'
    }

		return (
			<Codemirror ref="editor" options={options} value={value}
				onChange={this.handleChangeContent} />
		)
  }
}

MarkdownEditor.propTypes = {
  value: PropTypes.string.isRequired,
	currentBlog: PropTypes.object.isRequired
}

export default MarkdownEditor
