<table width="360" border="1" cellspacing="1" cellpadding="1">
    <tr>
        <td>
            <%echo(this.data.greeting);%>,
                <%echo(this.data.name);%>
        </td>
        <%var arr = [1, 2, 3, 4, 5, 6, 7]; for(var i = 0; i < arr.length; i++){%>
            <td>
                <%=arr[i]%>
            </td>
            <%}%>
    </tr>
</table>