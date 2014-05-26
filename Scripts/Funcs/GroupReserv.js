
$.ns('_JsL.Haiyou.Reservation.GroupReserv');

//#region GroupReserv
_JsL.Haiyou.Reservation.GroupReserv.View = _JsL.ListPager.View.extend({
    model: _JsL.ListPager.Model,
    getDisTemplate: function () {
        return [
        '<div class="block">',
            '<table class="tbBase">',
                '<thead>',
                    '<tr>',
                        '<th></th>',
                        '<th>', $Lang.Reservation.GroupReserv.LinkName, '</th>',
                        '<th>', $Lang.Reservation.GroupReserv.Phone, '</th>',
                        '<th>', $Lang.Reservation.GroupReserv.RoomPrice, '</th>',
                        '<th>', $Lang.Reservation.GroupReserv.RoomCount, '</th>',
                        '<th>', $Lang.Reservation.GroupReserv.Company, '</th>',
                        '<th>', $Lang.Reservation.GroupReserv.CheckInDate, '</th>',
                        '<th>', $Lang.Reservation.GroupReserv.CheckInDays, '</th>',
                        '<th>', $Lang.Reservation.GroupReserv.RoomAssign, '</th>',
                        '<th>', $Lang.Reservation.GroupReserv.KeepTime, '</th>',
                        '<th>', $Lang.Reservation.GroupReserv.ArrTime, '</th>',
                        '<th>', $Lang.Reservation.GroupReserv.CusCategoryType, '</th>',
                        '<th>', $Lang.Reservation.GroupReserv.RcpType, '</th>',
                        '<th>', $Lang.Reservation.GroupReserv.Src, '</th>',
                        '<th>', $Lang.Reservation.GroupReserv.IsGiveBreakfast, '</th>',
                        '<th>', $Lang.Reservation.GroupReserv.Remark, '</th>',
                        '<th>', $Lang.Reservation.GroupReserv.OrderId, '</th>',
                        '<th>', $Lang.Reservation.GroupReserv.OrderStatus, '</th>',
                    '</tr>',
                '</thead>',
                '<tbody class="content">',
                    '<tr><td colspan="18"><div class="loading"></div></td></tr>',
                '</tbody>',
            '</table>',
        '</div>'].join('');
    },
    getTemplate: function () {
        return [
            '{#foreach $T as row}',
                '<tr orderId="{$T.row.OrderID}">',
                    '<td><input groupName="Rsvnlist" type="checkbox" orderId="{$T.row.OrderID}"></td>',
                    '<td>{$T.row.LinkName}</td>',
                    '<td>{$T.row.LinkMobile}</td>',
                    '<td>{$T.row.RoomPrice}</td>',
                    '<td>{$T.row.RoomCount}</td>',
                    '<td>{$T.row.AgentName}</td>',
                    '<td>{$T.row.CheckInDate}</td>',
                    '<td>{$T.row.DaysCount}</td>',
                    '<td>{$T.row.RoomAssign}</td>',
                    '<td>{$T.row.KeepTime}</td>',
                    '<td>{$T.row.ArrTime}</td>',
                    '<td>{$T.row.CusCategoryName}</td>',
                    '<td>{$T.row.RcpnType}</td>',
                    '<td>{$T.row.Src}</td>',
                    '<td>{$T.row.IsGiveBreakfast}</td>',
                    '<td>{$T.row.Remark}</td>',
                    '<td>{$T.row.OrderID}</td>',
                    '<td>{$T.row.OrderStatus}</td>',
                '</tr>',
            '{#/for}',
                   
        ].join('');
    },
    formatData: function (d) {
        this.model.set({ pageRecord: d.Count });
        var results = d.Data;
        return results;
    },
    onClickRow: function (e) {
        //var rowObj = e.currentTarget;
    },
    onDbClickRow: function (e) {
        var rowObj = $(e.currentTarget);
        var orderID = $(rowObj).attr("orderId");
        window.location.href = _oldLinkPrefix + "Sale/RsvnTeamView.aspx?rID=" + orderID;
    },
    afterRender: function (d) {
        this.superclass.afterRender.call(this, d);
    }
});

//#endregion


