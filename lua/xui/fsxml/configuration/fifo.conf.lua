XML_STRING=[[
<configuration name="fifo.conf" description="FIFO Configuration">
  <settings>
    <param name="delete-all-outbound-member-on-startup" value="false"/>
    <param name="outbound-strategy" value="ringall"/>
    <param name="outbound_per_cycle" value="2"/>
  </settings>
  <fifos>
    <fifo name="cool_fifo@$${domain}" importance="0">
      <!--<member timeout="60" simo="1" lag="20">{member_wait=nowait}user/1005@$${domain}</member>-->
    </fifo>

    <fifo name="default" importance="0">
      <member timeout="60" simo="1" lag="2" outbound_per_cycle="2">{member_wait=nowait}user/1001@$${domain}</member>
      <member timeout="60" simo="1" lag="2" outbound_per_cycle="2">{member_wait=nowait}user/1002@$${domain}</member>
    </fifo>

  </fifos>
</configuration>
]]
