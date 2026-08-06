import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, Paper, Typography, IconButton, Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LoadingSkeleton from './LoadingSkeleton';

const DataTable = ({
  columns,
  rows,
  loading = false,
  page = 0,
  rowsPerPage = 10,
  totalCount = 0,
  onPageChange,
  onRowsPerPageChange,
  onView,
  onEdit,
  onDelete,
  customActions,
  emptyMessage = 'No records found',
  showActions = true,
}) => {
  if (loading) {
    return <LoadingSkeleton variant="table" rows={rowsPerPage} />;
  }

  const hasActions = showActions && (onView || onEdit || onDelete || customActions);

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.field}
                  align={col.align || 'left'}
                  sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}
                >
                  {col.headerName}
                </TableCell>
              ))}
              {hasActions && (
                <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (hasActions ? 1 : 0)} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">{emptyMessage}</Typography>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, index) => (
                <TableRow key={row.id || index} hover>
                  {columns.map((col) => (
                    <TableCell key={col.field} align={col.align || 'left'}>
                      {col.renderCell ? col.renderCell({ row, value: row[col.field] }) : row[col.field]}
                    </TableCell>
                  ))}
                  {hasActions && (
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5, alignItems: 'center', flexWrap: 'wrap' }}>
                        {customActions?.(row)}
                        {onView && (
                          <Tooltip title="View">
                            <IconButton size="small" onClick={() => onView(row)}>
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {onEdit && (
                          <Tooltip title="Edit">
                            <IconButton size="small" color="primary" onClick={() => onEdit(row)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {onDelete && (
                          <Tooltip title="Delete">
                            <IconButton size="small" color="error" onClick={() => onDelete(row)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {totalCount > 0 && (
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={(_, newPage) => onPageChange?.(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => onRowsPerPageChange?.(parseInt(e.target.value, 10))}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      )}
    </Paper>
  );
};

export default DataTable;
