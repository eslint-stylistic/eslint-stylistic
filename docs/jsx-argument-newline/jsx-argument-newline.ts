// {
//   code: ARGUMENT_NEW_LINE,
//     options: [{ argument: 'new-line' }],
//     },
// {
//   code: `
// foo(
//   <div>
//     {true
//     && (
//       <div>
//         <p>Some text</p>
//       </div>
//     )}
//   </div>,
// )`,
//     options: [{ argument: 'new-line' }],
//     },
// {
//   code: `foo(<div>text</div>)`,
//     options: [{ argument: 'new-line' }],
//     },
// {
//   code: `foo(<div>text</div>, <div>text</div>)`,
//     options: [{ argument: 'new-line' }],
//     },
// {
//   code: `foo(<div>
//         text
//         </div>,<div>text</div>)`,
//     options: [{ argument: 'new-line' }],
//     },

// const ARGUMENT_NO_PAREN = `
// var hello = foo(<div>
//   <p>Hello</p>
// </div>);
// `

// const ARGUMENT_NEW_LINE = `
// var hello = foo(
// <div>
//   <p>Hello</p>
// </div>
// );
// `

// const ARGUMENT_WITH_LOGICAL = `
// foo(<div>
//     {true && (
//       <div>
//         <p>Some text</p>
//       </div>
//     )}
//   </div>)
// `

// const ARGUMENT_WITH_LOGICAL_AUTOFIX = `
// foo(
// <div>
//     {true && (
//       <div>
//         <p>Some text</p>
//       </div>
//     )}
//   </div>
// )
// `

// {
//   code: ARGUMENT_NO_PAREN,
//     output: ARGUMENT_NEW_LINE,
//       options: [{ argument: 'new-line' }],
//         errors: [{ messageId: 'parensOnNewLines' }],
//     },
// {
//   code: ARGUMENT_WITH_LOGICAL,
//     output: ARGUMENT_WITH_LOGICAL_AUTOFIX,
//       options: [{ argument: 'new-line', logical: 'parens-new-line' }],
//         errors: [{ messageId: 'parensOnNewLines' }],
//     },
