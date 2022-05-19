import React from 'react'
import styled from 'styled-components'
import { useTable, usePagination, useSortBy, useRowSelect } from 'react-table'
import axios from 'axios';
import Button from '@mui/material/Button';

const Styles = styled.div`
padding: 1rem;

table {
	border-spacing: 0;
	border: 1px solid black;
	
	tr {
		:last-child {
			td {
				border-bottom: 0;
			}
		}
	}
	
	th,
	td {
		margin: 0;
		padding: 0.5rem;
		border-bottom: 1px solid black;
		border-right: 1px solid black;
		
		:last-child {
			border-right: 0;
		}
		
		input {
			font-size: 1rem;
			padding: 0;
			margin: 0;
			border: 0;
		}
	}
}

.pagination {
	padding: 0.5rem;
}
`

// Create an editable cell renderer
const EditableCell = ({
	value: initialValue,
	row: { index },
	column: { id },
	updateMyData, // This is a custom function that we supplied to our table instance
}) => {
	// We need to keep and update the state of the cell normally
	const [value, setValue] = React.useState(initialValue)
	
	const onChange = e => {
		setValue(e.target.value)
	}
	
	// We'll only update the external data when the input is blurred
	const onBlur = () => {
		updateMyData(index, id, value)
	}
	
	// If the initialValue is changed external, sync it up with our state
	React.useEffect(() => {
		setValue(initialValue)
	}, [initialValue])
	
	return <input value={value} onChange={onChange} onBlur={onBlur} />
}

const IndeterminateCheckbox = React.forwardRef(
	({ indeterminate, ...rest }, ref) => {
	  const defaultRef = React.useRef()
	  const resolvedRef = ref || defaultRef
  
	  React.useEffect(() => {
		resolvedRef.current.indeterminate = indeterminate
	  }, [resolvedRef, indeterminate])
  
	  return (
		<>
		  <input type="checkbox" ref={resolvedRef} {...rest} />
		</>
	  )
	}
	)
// Set our editable cell renderer as the default Cell renderer
const defaultColumn = {
	Cell: EditableCell,
}


// Be sure to pass our updateMyData and the skipPageReset option
function Table({ columns, data, updateMyData, skipPageReset }) {
	// For this example, we're using pagination to illustrate how to stop
	// the current page from resetting when our data changes
	// Otherwise, nothing is different here.
	
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		prepareRow,
		page,
		canPreviousPage,
		canNextPage,
		pageOptions,
		pageCount,
		gotoPage,
		nextPage,
		previousPage,
		setPageSize,
		selectedFlatRows,
		state: { pageIndex, pageSize, selectedRowIds },
	} = useTable(
		{
			columns,
			data,
			defaultColumn,
			// use the skipPageReset option to disable page resetting temporarily
			autoResetPage: !skipPageReset,
			// updateMyData isn't part of the API, but
			// anything we put into these options will
			// automatically be available on the instance.
			// That way we can call this function from our
			// cell renderer!
			updateMyData,
		},
		useSortBy,
		usePagination,
		useRowSelect,
		hooks => {
			hooks.visibleColumns.push(columns => [
			  // Let's make a column for selection
			  {
				id: 'selection',
				// The header can use the table's getToggleAllRowsSelectedProps method
				// to render a checkbox
				Header: ({ getToggleAllPageRowsSelectedProps }) => (
				  <div>
					<IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />
				  </div>
				),
				// The cell can use the individual row's getToggleRowSelectedProps method
				// to the render a checkbox
				Cell: ({ row }) => (
				  <div>
					<IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
				  </div>
				),
			  },
			  ...columns,
			])
		  }
		)
		
		// Functions for table management
		function Delete(e) {
			e.preventDefault();
			const deleteRows = []
			selectedFlatRows.forEach(element => deleteRows.push(element.values))
			axios.delete(
				`http://${process.env.REACT_APP_API_HOSTNAME}/items/`,{
				headers: {
					'accept': 'application/json',
					'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem('token')).access_token
				},
				data: deleteRows,
			})
				.then((response) => {
				})
				.catch((error) => console.log(error));
		}
		function saveChanges(e) {
			e.preventDefault();
			axios.put(
				`http://${process.env.REACT_APP_API_HOSTNAME}/items/`,
				data,
				{
					headers: {
						'accept': 'application/json',
						'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem('token')).access_token
					},
				},
				)
				// .then((response) => {
				// 	console.log(response)
				// })
				// .catch((error) => console.log(error));
		}

		// Render the UI for your table
		return (
			<>
			<table {...getTableProps()}>
			<thead>
			{headerGroups.map(headerGroup => (
				<tr {...headerGroup.getHeaderGroupProps()}>
				{headerGroup.headers.map(column => (
					<th {...column.getHeaderProps(column.getSortByToggleProps())}>
						{column.render('Header')}
						<span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
				  </th>
					))}
					</tr>
					))}
					</thead>
					<tbody {...getTableBodyProps()}>
					{page.map((row, i) => {
						prepareRow(row)
						return (
							<tr {...row.getRowProps()}>
							{row.cells.map(cell => {
								return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
							})}
							</tr>
							)
						})}
						</tbody>
						</table>
						<div className="pagination">
						<button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
						{'<<'}
						</button>{' '}
						<button onClick={() => previousPage()} disabled={!canPreviousPage}>
						{'<'}
						</button>{' '}
						<button onClick={() => nextPage()} disabled={!canNextPage}>
						{'>'}
						</button>{' '}
						<button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
						{'>>'}
						</button>{' '}
						<span>
						Page{' '}
						<strong>
						{pageIndex + 1} of {pageOptions.length}
						</strong>{' '}
						</span>
						<span>
						| Go to page:{' '}
						<input
						type="number"
						defaultValue={pageIndex + 1}
						onChange={e => {
							const page = e.target.value ? Number(e.target.value) - 1 : 0
							gotoPage(page)
						}}
						style={{ width: '100px' }}
						/>
						</span>{' '}
						<select
						value={pageSize}
						onChange={e => {
							setPageSize(Number(e.target.value))
						}}
						>
						{[10, 20, 30, 40, 50].map(pageSize => (
							<option key={pageSize} value={pageSize}>
							Show {pageSize}
							</option>
							))}
							</select>
							<pre>
							<Button variant="contained" 
							onClick={saveChanges}>
							Save changes
							</Button>
							<Button variant="contained" 
							onClick={Delete}>
							Delete
							</Button>
							</pre>
							</div>
							</>
							)
						}
						
function App() {
	axios.get(
		`http://${process.env.REACT_APP_API_HOSTNAME}/items/`,
		{
			headers: {
				'accept': 'application/json',
				'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem('token')).access_token
			},
		},
		)
		.then((response) => {
			sessionStorage.setItem('items', JSON.stringify(response.data))
		})
		.catch((error) => console.log(error));
		
		const keys = Object.keys(JSON.parse(sessionStorage.getItem('items'))[0])
		const cols = []
		
		for (const key in keys){
			cols.push({
				Header: keys[key],
				accessor: keys[key],
			})
		}
		
		const columns = React.useMemo(
			() => cols
			)
			
			const [data, setData] = React.useState(JSON.parse(sessionStorage.getItem('items')))
			const [skipPageReset, setSkipPageReset] = React.useState(false)			
			const updateMyData = (rowIndex, columnId, value) => {
				// We also turn on the flag to not reset the page
				setSkipPageReset(true)
				setData(old =>
					old.map((row, index) => {
						if (index === rowIndex) {
							return {
								...old[rowIndex],
								[columnId]: value,
							}
						}
						return row
					})
					)
				}
				
				React.useEffect(() => {
					setSkipPageReset(false)
				}, [data])
				
				return (
					<Styles>
					<Table
					columns={columns}
					data={data}
					updateMyData={updateMyData}
					skipPageReset={skipPageReset}
					/>
					</Styles>
					)
				}
				export default App
				